// Tells Bing, Yandex and other IndexNow engines (Bing also feeds ChatGPT and Copilot search)
// that every URL in the live sitemap changed. Run after a deploy: npm run indexnow
const site = "https://clinova.novanoai.online";
const key = "66ec632c7dc593f029fd60c57d3a6b81"; // Must match public/66ec632c7dc593f029fd60c57d3a6b81.txt

const sitemap = await (await fetch(`${site}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList }),
});
console.log(`IndexNow: ${response.status} ${response.statusText} for ${urlList.length} URLs`);
if (!response.ok && response.status !== 202) process.exitCode = 1;
