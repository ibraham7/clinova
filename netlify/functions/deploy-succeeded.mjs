// Runs by itself after every successful Netlify deploy (an event-triggered function: the file name is the event).
// After a production deploy it tells IndexNow engines (Bing, which also feeds ChatGPT and Copilot search, Yandex,
// Seznam, Naver) that the pages in the sitemap changed, so new and edited articles are crawled within hours.
// The same as `npm run indexnow`, without anyone having to run it.
const site = "https://clinova.novanoai.online";
const key = "66ec632c7dc593f029fd60c57d3a6b81"; // Must match public/66ec632c7dc593f029fd60c57d3a6b81.txt

export default async function handler(request) {
    let payload = {};
    try { payload = (await request.json())?.payload ?? {}; } catch { /* No body: treat as unknown context. */ }
    if (payload.context && payload.context !== "production") return new Response("skipped: not production");
    try {
        const sitemap = await (await fetch(`${site}/sitemap.xml`, { cache: "no-store" })).text();
        const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
        if (!urlList.length) return new Response("skipped: empty sitemap");
        const response = await fetch("https://api.indexnow.org/indexnow", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList }),
        });
        console.log(`IndexNow: ${response.status} for ${urlList.length} URLs`);
        return new Response(`IndexNow ${response.status}`);
    } catch (error) {
        // Never fails the deploy; the next deploy tries again.
        console.log(`IndexNow failed: ${error?.message}`);
        return new Response("IndexNow failed");
    }
}
