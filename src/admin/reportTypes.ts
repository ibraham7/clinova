// Shape of the report returned by netlify/functions/admin-reports.mjs (built in netlify/lib/reports.mjs).
export type ReportFilters = { from: string; to: string; country?: string; device?: string; lang?: string; source?: string; channel?: string; path?: string };

export type Summary = {
    visitors: number; pageViews: number; avgSeconds: number; avgScroll: number; engagedRate: number;
    leads: number; surveyLeads: number; profileLeads: number; conversionRate: number;
};
type Share = { visitors: number; share: number };

export type Report = {
    range: { from: string; to: string; fromDay: string; toDay: string };
    truncated: boolean;
    summary: Summary;
    previous: Summary;
    daily: { date: string; visitors: number; pageViews: number; leads: number }[];
    sections: { id: string; visitors: number; reach: number; avgSeconds: number; exits: number }[];
    pages: { path: string; visitors: number; views: number }[];
    countries: ({ code: string; name: string; leads: number } & Share)[];
    cities: { city: string; country: string; visitors: number }[];
    sources: ({ source: string; channel: string; leads: number } & Share)[];
    channels: ({ channel: string } & Share)[];
    devices: ({ device: string } & Share)[];
    browsers: ({ browser: string } & Share)[];
    os: ({ os: string } & Share)[];
    languages: ({ lang: string } & Share)[];
    campaigns: { campaign: string; source: string | null; medium: string | null; visitors: number }[];
    hours: { hour: number; visitors: number }[];
    clicks: { target: string; section: string | null; visitors: number; count: number }[];
    scroll: { depth: number; visitors: number; share: number }[];
    survey: { shown: number; dismissed: number; completed: number; steps: { step: number; visitors: number }[]; answers: Record<string, Record<string, number>>; wishes: string[] };
    articles: { slug: string; title: string; date: string; views: number; visitors: number }[];
    changes: { ts: string; date: string; action: string; summary: string }[];
    leads: {
        ts: string; purpose: string; contactType: string; contact: string; phoneCountry: string | null; lang: string; form: string;
        consent: boolean; answers: Record<string, string> | null; country: string | null; city: string | null; source: string | null;
    }[];
    recent: { ts: string; type: string; path: string; section: string | null; target: string | null; value: number | null; country: string | null; city: string | null; device: string | null; source: string | null }[];
};
