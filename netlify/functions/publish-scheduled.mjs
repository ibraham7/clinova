// Runs by itself on a schedule (Monday, Wednesday and Friday at 06:00 UTC). It asks Netlify to rebuild the site, and
// the build publishes every article whose date has come (see src/blog/articles.ts), so three articles go live each week.
// Needs one environment variable in Netlify: PUBLISH_BUILD_HOOK = the URL of a build hook
// (Site configuration > Build & deploy > Build hooks > Add build hook).
export const config = { schedule: "0 6 * * 1,3,5" };

export default async function handler() {
    const hook = process.env.PUBLISH_BUILD_HOOK;
    if (!hook) { console.log("publish-scheduled: PUBLISH_BUILD_HOOK is not set, nothing was rebuilt"); return new Response("not configured", { status: 200 }); }
    try {
        const response = await fetch(hook, { method: "POST" });
        console.log(`publish-scheduled: rebuild requested (${response.status})`);
        return new Response(`rebuild ${response.status}`);
    } catch (error) {
        console.log(`publish-scheduled: failed (${error?.message})`);
        return new Response("failed", { status: 200 });
    }
}
