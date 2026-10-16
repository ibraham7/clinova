// Fails when an Arabic text in the admin panel code has no English, Turkish and French translation
// (in src/admin/translations.ts or the site's own locale files). Run with `npm run check:admin-i18n`.
import { readFileSync, readdirSync } from "node:fs";
import ts from "typescript";

const source = readFileSync("src/admin/translations.ts", "utf8");
const file = ts.createSourceFile("translations.ts", source, ts.ScriptTarget.Latest);
const translations = new Map();
file.forEachChild(function visit(node) {
    if (ts.isPropertyAssignment(node) && ts.isStringLiteral(node.name) && ts.isArrayLiteralExpression(node.initializer)) {
        translations.set(node.name.text, node.initializer.elements.map((element) => element.text));
    }
    node.forEachChild(visit);
});
const site = ["en", "tr", "fr"].map((lang) => JSON.parse(readFileSync(`src/i18n/locales/${lang}.json`, "utf8")));
const arabic = /[؀-ۿ]/;
const placeholders = (text) => (text.match(/\{\w+\}/g) ?? []).sort().join();
const problems = [];

for (const [key, values] of translations) {
    if (values.length !== 3 || values.some((value) => !value?.trim() || arabic.test(value))) problems.push(`incomplete translation: ${key}`);
    else if (values.some((value) => placeholders(value) !== placeholders(key))) problems.push(`placeholders differ: ${key}`);
}

const files = readdirSync("src/admin").filter((name) => /\.tsx?$/.test(name) && name !== "translations.ts");
for (const name of files) {
    const code = ts.createSourceFile(name, readFileSync(`src/admin/${name}`, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    code.forEachChild(function visit(node) {
        const text = ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) ? node.text : ts.isJsxText(node) ? node.text.trim() : "";
        if (text && arabic.test(text) && !translations.has(text) && !site.every((locale) => locale[text])) problems.push(`${name}: no translation for "${text}"`);
        node.forEachChild(visit);
    });
}

if (problems.length) {
    console.error(problems.join("\n"));
    process.exit(1);
}
console.log(`Admin i18n: ${translations.size} texts translated into English, Turkish and French`);
