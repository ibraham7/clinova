// Google Gemini over REST (https://ai.google.dev/api/generate-content), shared by Serena and the article writer:
// the model chain with fallbacks for busy or slow models, and the thinking level each model accepts.
const gemini = "https://generativelanguage.googleapis.com/v1beta";

export class GeminiError extends Error {
    constructor(message, status) { super(message); this.status = status; }
}

export async function call(path, apiKey, init = {}, timeout = 20_000) {
    const response = await fetch(`${gemini}/${path}`, {
        ...init,
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        signal: AbortSignal.timeout(timeout),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new GeminiError(data?.error?.message ?? `gemini_${response.status}`, response.status);
    return data;
}

// The models to try, in order: GEMINI_MODEL if set, then the newest stable Flash, the newest Flash-Lite and
// the previous generation of each. When one is busy (Google answers "high demand") or slow, the next one answers.
let cachedModels = null;
// A model that was busy or slow is skipped for 10 minutes.
export const skipUntil = new Map();
export async function chooseModels(apiKey) {
    if (cachedModels) return cachedModels;
    const data = await call("models?pageSize=200", apiKey, {}, 8_000);
    const names = (data.models ?? [])
        .filter((model) => model.supportedGenerationMethods?.includes("generateContent"))
        .map((model) => model.name.replace(/^models\//, ""))
        .filter((name) => /^gemini-[\d.]+-flash/.test(name) && !/image|tts|audio|live|exp|preview|thinking/.test(name));
    const version = (name) => Number(name.match(/^gemini-([\d.]+)/)?.[1] ?? 0);
    const byVersion = (list) => [...list].sort((a, b) => version(b) - version(a) || a.length - b.length);
    const full = byVersion(names.filter((name) => !name.includes("lite")));
    const lite = byVersion(names.filter((name) => name.includes("lite")));
    const chain = [process.env.GEMINI_MODEL, full[0], lite[0], full.find((name) => version(name) < version(full[0] ?? "")), lite.find((name) => version(name) < version(lite[0] ?? ""))];
    cachedModels = [...new Set(chain.filter(Boolean))].slice(0, 4);
    if (!cachedModels.length) throw new GeminiError("No Gemini Flash model is available for this key.", 404);
    return cachedModels;
}
export const transient = (error) => error?.name === "TimeoutError" || error?.name === "AbortError" || (error instanceof GeminiError && [429, 500, 502, 503, 504].includes(error.status));

// Short, fast answers: the lowest thinking level each model accepts. Models differ ("minimal" is not
// accepted everywhere), so a level a model rejects is remembered and the next one is tried.
const thinkingLevels = ["minimal", "low", null];
const rejectedLevels = new Map();
export function thinkingFor(model) {
    const version = Number(model.match(/^gemini-([\d.]+)/)?.[1] ?? 0);
    if (version >= 3) {
        const level = thinkingLevels[rejectedLevels.get(model) ?? 0];
        return level ? { thinkingConfig: { thinkingLevel: level } } : {};
    }
    if (version >= 2.5 && !rejectedLevels.has(model)) return { thinkingConfig: { thinkingBudget: 0 } };
    return {};
}
/** True when Gemini refused the thinking setting; the next call then uses the next level (or none). */
export function rejectThinking(model, error) {
    if (!(error instanceof GeminiError) || error.status !== 400 || !/thinking/i.test(error.message)) return false;
    const next = (rejectedLevels.get(model) ?? 0) + 1;
    if (next >= thinkingLevels.length) return false;
    rejectedLevels.set(model, next);
    return true;
}


/**
 * One plain text answer (no tools) from the first model that answers within `budgetMs`, falling back along the
 * model chain when a model is busy or slow, like Serena does.
 */
export async function generateText(apiKey, { system, prompt, maxOutputTokens = 4000, budgetMs = 25_000 }) {
    const started = Date.now();
    const models = await chooseModels(apiKey);
    const available = models.filter((name) => (skipUntil.get(name) ?? 0) < Date.now());
    const order = available.length ? available : models;
    let lastError = null;
    for (let index = 0; index < order.length; index++) {
        const name = order[index];
        const remaining = budgetMs - (Date.now() - started);
        if (remaining < 2_000) break;
        const timeout = Math.round(index === order.length - 1 ? remaining : Math.max(remaining * 0.6, 8_000));
        try {
            for (;;) {
                try {
                    const data = await call(`models/${encodeURIComponent(name)}:generateContent`, apiKey, {
                        method: "POST",
                        body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens, ...thinkingFor(name) } }),
                    }, Math.min(timeout, budgetMs - (Date.now() - started)));
                    const parts = data.candidates?.[0]?.content?.parts ?? [];
                    const text = parts.filter((part) => part.text && !part.thought).map((part) => part.text).join("");
                    if (!text) throw new GeminiError("empty_answer", 502);
                    return { text, model: name, truncated: data.candidates?.[0]?.finishReason === "MAX_TOKENS" };
                } catch (error) {
                    if (!rejectThinking(name, error)) throw error;
                }
            }
        } catch (error) {
            lastError = error;
            if (!transient(error)) throw error;
            skipUntil.set(name, Date.now() + 10 * 60_000);
        }
    }
    throw lastError ?? new GeminiError("timeout", 504);
}
