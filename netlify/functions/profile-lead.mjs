import settings from '../../src/config/profile-leads.json' with { type: 'json' };

const reply = (status, data) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
function validLead(p) {
    if (!p || p.purpose !== 'company_profile_download' || !p.contact || typeof p.contact.value !== 'string') return false;
    if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(p.requestId ?? '')) return false;
    if (typeof p.marketingConsent !== 'boolean' || !['ar','en','tr','fr'].includes(p.language) || !['hero','contact_cta'].includes(p.source)) return false;
    if (p.contact.country && !/^[A-Z]{2}$/.test(p.contact.country)) return false;
    return p.contact.type === 'email'
        ? p.contact.value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.contact.value)
        : p.contact.type === 'phone' && /^\+[1-9]\d{6,14}$/.test(p.contact.value);
}

export default async function handler(request) {
    if (request.method !== 'POST') return reply(405, { ok: false, error: 'method_not_allowed' });
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) return reply(403, { ok: false, error: 'invalid_origin' });
    let payload;
    try {
        if (Number(request.headers.get('content-length')) > 4096) return reply(413, { ok: false, error: 'too_large' });
        const body = await request.text();
        if (new TextEncoder().encode(body).length > 4096) return reply(413, { ok: false, error: 'too_large' });
        payload = JSON.parse(body);
    } catch { return reply(400, { ok: false, error: 'invalid_request' }); }
    if (!validLead(payload)) return reply(400, { ok: false, error: 'invalid_contact' });
    // Same requestId across attempts: the Sheets receiver deduplicates under a lock.
    // Follow Google's one-time response redirect on the server, outside browser CORS.
    for (let attempt = 0; attempt < 2; attempt++) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 24000);
        try {
            const response = await fetch(settings.endpoint, {
                method: 'POST', redirect: 'follow', cache: 'no-store', signal: controller.signal,
                headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify(payload),
            });
            if (response.ok) {
                const result = await response.json();
                if (result?.ok === true) return reply(200, { ok: true });
                if (['invalid_request','invalid_contact','not_configured','sheet_not_ready'].includes(result?.error)) break;
            } else if (![404,408,429].includes(response.status) && response.status < 500) break;
        } catch { /* Retry transient transport/redirect failures without logging contact data. */ }
        finally { clearTimeout(timeout); }
    }
    return reply(503, { ok: false, error: 'save_unconfirmed' });
}
