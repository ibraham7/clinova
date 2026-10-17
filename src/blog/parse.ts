// A deliberately small Markdown subset for articles:
// front matter (title, description, date, optional cover image path), "> " key takeaway, "## " headings, "- " / "1. " lists,
// "Q: " / "A: " FAQ pairs, plain paragraphs, and inline **bold** and [links](/path).
export type ArticleBlock =
    | { type: "h2"; text: string; id: string }
    | { type: "p"; text: string }
    | { type: "ul" | "ol"; items: string[] };

export type ParsedArticle = {
    title: string;
    /** Optional shorter title for search results; the page heading keeps the full title. */
    seoTitle?: string;
    description: string;
    date: string;
    updated?: string;
    /** Cover image under /uploads/blog (added from the admin panel), shown on the card, the article and in shares. */
    cover?: string;
    summary: string;
    blocks: ArticleBlock[];
    faq: { q: string; a: string }[];
    words: number;
};

export function plainText(text: string) {
    return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[(.+?)\]\((.+?)\)/g, "$1");
}

function slugify(text: string, index: number) {
    const ascii = plainText(text).toLowerCase().replace(/[^a-z0-9؀-ۿÀ-ɏ]+/g, "-").replace(/^-+|-+$/g, "");
    return ascii || `section-${index + 1}`;
}

export function parseArticle(source: string): ParsedArticle {
    const match = /^---\n([\s\S]*?)\n---\n/.exec(source);
    if (!match) throw new Error("Article is missing front matter");
    const meta = Object.fromEntries(match[1].split("\n").map((line) => {
        const at = line.indexOf(":");
        return [line.slice(0, at).trim(), line.slice(at + 1).trim()];
    }));
    const blocks: ArticleBlock[] = [];
    const faq: { q: string; a: string }[] = [];
    const summary: string[] = [];
    let paragraph: string[] = [];
    let list: { type: "ul" | "ol"; items: string[] } | null = null;
    const flush = () => {
        if (paragraph.length) blocks.push({ type: "p", text: paragraph.join(" ") });
        if (list) blocks.push(list);
        paragraph = [];
        list = null;
    };
    for (const raw of source.slice(match[0].length).split("\n")) {
        const line = raw.trim();
        if (!line) { flush(); continue; }
        if (line.startsWith("> ")) { summary.push(line.slice(2)); continue; }
        if (line.startsWith("## ")) { flush(); blocks.push({ type: "h2", text: line.slice(3), id: slugify(line.slice(3), blocks.length) }); continue; }
        if (line.startsWith("Q: ")) { flush(); faq.push({ q: line.slice(3), a: "" }); continue; }
        if (line.startsWith("A: ")) { faq[faq.length - 1].a = line.slice(3); continue; }
        const bullet = /^- (.*)$/.exec(line);
        const numbered = /^\d+\. (.*)$/.exec(line);
        if (bullet || numbered) {
            const type = bullet ? "ul" : "ol";
            if (paragraph.length || (list && list.type !== type)) flush();
            list ??= { type, items: [] };
            list.items.push((bullet ?? numbered)![1]);
            continue;
        }
        if (list) flush();
        paragraph.push(line);
    }
    flush();
    const text = [summary.join(" "), ...blocks.map((block) => ("text" in block ? block.text : block.items.join(" "))), ...faq.map((item) => `${item.q} ${item.a}`)].join(" ");
    return {
        title: meta.title, seoTitle: meta.seoTitle, description: meta.description, date: meta.date, updated: meta.updated, cover: meta.cover || undefined,
        summary: summary.join(" "), blocks, faq, words: plainText(text).split(/\s+/).filter(Boolean).length,
    };
}
