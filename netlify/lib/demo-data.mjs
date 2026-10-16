// Demo data for testing the reports page and Serena: realistic, made-up visitors, leads and changes,
// generated on the fly (nothing is written to Supabase). The same day always gives the same rows.
// Built-in story, relative to today, for checking that Serena finds it:
// - Tracking starts 120 days ago; traffic grows slowly, Fridays are quieter, evenings (Istanbul) are busiest.
// - 30 days ago the dental-marketing article is published: Google traffic and leads from Saudi Arabia and Turkey rise.
// - 20 to 13 days ago a paid Instagram campaign (utm_campaign=insta_oct) brings many mobile visitors who leave the hero within seconds.
// - 14 days ago the hero and survey texts are edited: survey completions roughly double.
// - Many visitors stop at "services" and "contact-system"; ChatGPT brings few visitors who convert well.
import { localDate } from "./reports.mjs";

const dayMs = 86_400_000;
const offsetMs = 3 * 3600_000;

function random(seed) {
    let state = 2166136261;
    for (const char of seed) state = Math.imul(state ^ char.charCodeAt(0), 16777619);
    return () => {
        state = (state + 0x6D2B79F5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const pick = (rand, weighted) => {
    const total = weighted.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = rand() * total;
    for (const [value, weight] of weighted) if ((roll -= weight) < 0) return value;
    return weighted.at(-1)[0];
};

const countries = {
    SA: ["Saudi Arabia", ["Riyadh", "Jeddah", "Dammam"], "ar"], TR: ["Türkiye", ["Istanbul", "Ankara", "Izmir"], "tr"],
    AE: ["United Arab Emirates", ["Dubai", "Abu Dhabi"], "ar"], EG: ["Egypt", ["Cairo", "Alexandria"], "ar"],
    IQ: ["Iraq", ["Baghdad", "Erbil"], "ar"], JO: ["Jordan", ["Amman"], "ar"], KW: ["Kuwait", ["Kuwait City"], "ar"],
    FR: ["France", ["Paris", "Lyon"], "fr"], DE: ["Germany", ["Berlin"], "en"], GB: ["United Kingdom", ["London"], "en"],
};
const sections = ["home", "about", "reach", "services", "contact-system", "specialties", "case-studies", "reviews", "client-videos", "partners", "faq", "contact-cta"];
// Chance of leaving after each section (higher at services and the patient journey).
const leave = { home: 0.22, about: 0.08, reach: 0.08, services: 0.3, "contact-system": 0.28, specialties: 0.1, "case-studies": 0.1, reviews: 0.12, "client-videos": 0.1, partners: 0.15, faq: 0.25, "contact-cta": 1 };
const answers = {
    specialty: [["طب الأسنان", 5], ["الجلدية والتجميل", 3], ["الجراحة التجميلية", 2], ["زراعة الشعر", 2], ["تخصص آخر", 1]],
    patients: [["أقل من 50 مريضًا", 2], ["من 50 إلى 150 مريضًا", 4], ["من 150 إلى 300 مريض", 2], ["أكثر من 300 مريض", 1]],
    workflow: [["يدويًا عبر الهاتف والواتساب", 5], ["موظف استقبال بدون نظام", 3], ["نظام حجز أو CRM", 1], ["لا توجد طريقة ثابتة", 2]],
    need: [["مرضى جدد أكثر", 5], ["تحويل الاستفسارات إلى حجوزات", 4], ["متابعة المرضى وإعادتهم", 2], ["معرفة نتائج التسويق بالأرقام", 2], ["تنظيم الفريق والمواعيد", 1]],
};
const wishes = [
    "نريد الرد على رسائل الواتساب بالليل لأن أغلب الاستفسارات تأتي بعد العاشرة",
    "كم السعر الشهري؟ لم أجد الأسعار في الموقع",
    "نحتاج تقارير توضح من أين يأتي كل مريض",
    "هل يوجد نظام باللغة التركية للموظفين؟",
    "نريد زيادة مرضى زراعة الشعر من الخليج",
    "أريد مثالًا حقيقيًا لعيادة أسنان عملت معكم",
    "المرضى يسألون عن السعر ثم يختفون",
];

const today = () => localDate(new Date().toISOString());
const daysBefore = (day, count) => new Date(Date.parse(`${day}T00:00:00Z`) - count * dayMs).toISOString().slice(0, 10);
const story = (now = today()) => ({
    start: daysBefore(now, 120), article: daysBefore(now, 30), campaignFrom: daysBefore(now, 20), campaignTo: daysBefore(now, 13), edit: daysBefore(now, 14),
});

/** Everything one day brings: page events and leads. */
function day(date, plot) {
    const rand = random(`clinova-demo:${date}`);
    const events = [];
    const leads = [];
    if (date < plot.start || date > today()) return { events, leads };
    const age = (Date.parse(date) - Date.parse(plot.start)) / dayMs;
    const friday = new Date(`${date}T00:00:00Z`).getUTCDay() === 5;
    const afterArticle = date >= plot.article;
    const campaign = date >= plot.campaignFrom && date <= plot.campaignTo;
    const afterEdit = date >= plot.edit;
    const organic = Math.round((14 + age * 0.12 + (afterArticle ? 9 : 0)) * (friday ? 0.7 : 1) * (0.8 + rand() * 0.4));
    const count = organic + (campaign ? 18 + Math.floor(rand() * 10) : 0);

    for (let index = 0; index < count; index++) {
        const visitor = `demo${date.replaceAll("-", "")}${String(index).padStart(3, "0")}`;
        const fromCampaign = index >= organic;
        const channelSource = fromCampaign ? ["Instagram", "campaign"] : pick(rand, [
            [["Google", "search"], afterArticle ? 46 : 30], [["Direct", "direct"], 22], [["Instagram", "social"], 12], [["Facebook", "social"], 6],
            [["LinkedIn", "social"], 5], [["ChatGPT", "ai"], 4], [["Bing", "search"], 3], [["dentalforum.net", "referral"], 2],
        ]);
        const [source, channel] = channelSource;
        const country = fromCampaign ? pick(rand, [["SA", 4], ["AE", 2], ["KW", 1], ["TR", 1]]) : pick(rand, [
            ["SA", afterArticle && source === "Google" ? 9 : 5], ["TR", afterArticle && source === "Google" ? 7 : 5], ["AE", 3], ["EG", 3], ["IQ", 2], ["JO", 1], ["KW", 1], ["FR", 1], ["DE", 1], ["GB", 1],
        ]);
        const [countryName, cities, lang] = countries[country];
        const device = fromCampaign || ["Instagram", "Facebook"].includes(source) ? (rand() < 0.92 ? "mobile" : "desktop") : pick(rand, [["mobile", 6], ["desktop", 3.5], ["tablet", 0.5]]);
        const os = device === "desktop" ? pick(rand, [["Windows", 7], ["macOS", 3]]) : pick(rand, [["Android", 5], ["iOS", 5]]);
        const browser = os === "iOS" || os === "macOS" ? (rand() < 0.8 ? "Safari" : "Chrome") : pick(rand, [["Chrome", 8], ["Samsung Internet", 1], ["Edge", 1]]);
        const landing = source === "ChatGPT" ? `/${lang}/blog/whatsapp-ai-for-clinics`
            : source === "Google" && afterArticle && rand() < 0.45 ? `/${lang}/blog/dental-clinic-marketing`
                : source === "Google" && rand() < 0.2 ? `/${lang}/blog/clinic-patient-acquisition` : `/${lang}`;
        const hour = pick(rand, Array.from({ length: 24 }, (_, h) => [h, h >= 20 && h <= 23 ? 9 : h >= 10 && h <= 14 ? 5 : h < 7 ? 0.6 : 3]));
        let ts = Date.parse(`${date}T00:00:00Z`) - offsetMs + hour * 3600_000 + Math.floor(rand() * 3500_000);
        const shared = {
            visitor, lang, source, channel, device, browser, os, country, country_name: countryName, city: cities[Math.floor(rand() * cities.length)],
            utm_source: fromCampaign ? "instagram" : null, utm_medium: fromCampaign ? "paid_social" : null, utm_campaign: fromCampaign ? "insta_oct" : null,
        };
        let path = landing;
        const push = (type, extra = {}) => { events.push({ id: events.length + 1, ts: new Date(ts).toISOString(), type, path, section: null, target: null, value: null, ...shared, ...extra }); };
        push("page_view");

        // Quick bounces: most campaign visitors, some social ones.
        const bounce = fromCampaign ? rand() < 0.78 : channel === "social" ? rand() < 0.45 : rand() < 0.18;
        let visibleMs = 0;
        let exit = "home";
        let seenCta = false;
        if (bounce) {
            visibleMs = 1500 + Math.floor(rand() * 5000);
            push("section", { section: "home", value: visibleMs });
            push("scroll", { value: 5 + Math.floor(rand() * 15) });
        } else {
            const isArticle = landing.includes("/blog/");
            if (isArticle) {
                const reading = 40_000 + Math.floor(rand() * 180_000);
                ts += reading;
                visibleMs += reading;
                exit = rand() < 0.35 ? "contact-cta" : "home";
                if (exit === "contact-cta") seenCta = true;
            }
            // Article readers who continue open the home page next.
            const next = isArticle && rand() < 0.4;
            if (next) { path = `/${lang}`; push("page_view"); }
            for (const section of isArticle && !next ? [] : sections) {
                const ms = (section === "services" || section === "contact-system" ? 9000 : 4000) + Math.floor(rand() * 14000);
                ts += ms;
                visibleMs += ms;
                exit = section;
                push("section", { section, value: ms });
                if (section === "services" && rand() < 0.25) push("click", { target: "nav:contact-cta", section });
                if (section === "home" && rand() < 0.1) push("click", { target: "whatsapp", section });
                if (section === "contact-cta") { seenCta = true; if (rand() < 0.3) push("click", { target: "whatsapp", section }); }
                if (rand() < leave[section]) break;
            }
            push("scroll", { value: Math.min(100, Math.round((sections.indexOf(exit) + 1) / sections.length * 100)) });
        }

        // Survey popup: shown to visitors who stay 20s+.
        let lead = null;
        if (visibleMs > 20_000 && rand() < 0.75) {
            push("survey", { target: "shown" });
            const completeChance = (afterEdit ? 0.2 : 0.09) * (source === "ChatGPT" ? 2 : 1);
            if (rand() < completeChance) {
                for (let step = 1; step <= 5; step++) push("survey", { target: "step", value: step });
                push("survey", { target: "completed" });
                lead = "trial_survey";
            } else {
                const stopped = Math.floor(rand() * 4);
                for (let step = 1; step <= stopped; step++) push("survey", { target: "step", value: step });
                push("survey", { target: "dismissed", value: stopped });
            }
        }
        // Company profile download from the call-to-action.
        if (!lead && seenCta) {
            const chance = (source === "ChatGPT" ? 0.35 : source === "Google" ? 0.16 : 0.06) * (["SA", "TR"].includes(country) ? 1.3 : 1);
            if (rand() < chance) { push("click", { target: "button:تحميل البروفايل", section: "contact-cta" }); lead = "company_profile_download"; }
        }
        ts += 2000;
        push("page_end", { section: exit, value: visibleMs });

        if (lead) {
            const email = rand() < 0.6;
            leads.push({
                id: leads.length + 1, ts: new Date(ts).toISOString(), purpose: lead, contact_type: email ? "email" : "phone",
                contact: email ? `demo.clinic${index}@example.com` : `+000 000 ${String(index).padStart(4, "0")}`, phone_country: email ? null : country,
                lang, form_source: lead === "trial_survey" ? "survey_popup" : "contact_cta", consent: rand() < 0.7, visitor, country, city: shared.city,
                answers: lead === "trial_survey" ? { ...Object.fromEntries(Object.entries(answers).map(([question, options]) => [question, pick(rand, options)])), wish: rand() < 0.5 ? wishes[Math.floor(rand() * wishes.length)] : "" } : null,
            });
        }
    }
    return { events, leads };
}

function rows(from, to) {
    const plot = story();
    const events = [];
    const leads = [];
    for (let date = localDate(from); Date.parse(`${date}T00:00:00Z`) - offsetMs < Date.parse(to); date = daysBefore(date, -1)) {
        const result = day(date, plot);
        events.push(...result.events.filter((event) => event.ts >= from && event.ts < to));
        leads.push(...result.leads.filter((lead) => lead.ts >= from && lead.ts < to));
    }
    events.forEach((event, index) => { event.id = index + 1; });
    leads.forEach((lead, index) => { lead.id = index + 1; });
    return { events, leads };
}

/** Demo inputs for buildReport, plus the demo trackingSince. Real article slugs get made-up publish dates. */
export function demoInputs(range, previousRange, realArticles = []) {
    const plot = story();
    const now = rows(range.from, range.to);
    const before = rows(previousRange.from, previousRange.to);
    const spread = [75, 62, 48, 40, 22, 9, 4];
    let next = 0;
    const articles = realArticles.map((article) => ({ ...article, date: article.slug === "dental-clinic-marketing" ? plot.article : daysBefore(today(), spread[next++ % spread.length]) }));
    const at = (date, hour) => new Date(Date.parse(`${date}T${String(hour).padStart(2, "0")}:00:00Z`) - offsetMs).toISOString();
    const adminLog = [
        { id: 1, ts: at(daysBefore(today(), 55), 11), action: "logos", summary: "إضافة شعار: عيادة الابتسامة، مركز ديرما" },
        { id: 2, ts: at(daysBefore(today(), 35), 15), action: "videos", summary: "إضافة فيديو: د. سارة - عيادة أسنان في الرياض" },
        { id: 3, ts: at(plot.edit, 13), action: "texts", summary: "تعديل 6 نص: hero.title | hero.subtitle | survey.offer" },
    ].filter((entry) => entry.ts < range.to);
    return { events: now.events, previousEvents: before.events, leads: now.leads, previousLeads: before.leads, adminLog, articles, trackingSince: at(plot.start, 9) };
}
