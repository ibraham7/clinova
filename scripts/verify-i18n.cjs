// Render every locale to verify dictionaries, translated content and persisted direction.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const workspace = fs.mkdtempSync(path.join(root, 'node_modules', '.clinova-i18n-'));
const locales = ['ar', 'en', 'tr', 'fr'];
const resources = Object.fromEntries(locales.map((locale) => [locale, JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/locales', locale + '.json'), 'utf8'))]));
const baseKeys = Object.keys(resources.ar).sort();
for (const locale of locales) {
    assert.deepEqual(Object.keys(resources[locale]).sort(), baseKeys, locale + ': missing translations');
    for (const [key, value] of Object.entries(resources[locale])) {
        assert.ok(value.trim(), locale + ': empty ' + key);
        const tokens = (text) => [...text.matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1]).sort();
        assert.deepEqual(tokens(value), tokens(key), locale + ': missing interpolation ' + key);
    }
}
function compile(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const source = path.join(directory, entry.name);
        const relative = path.relative(root, source);
        if (entry.isDirectory()) compile(source);
        else if (/\.tsx?$/.test(source)) {
            const target = path.join(workspace, relative.replace(/\.tsx?$/, '.js'));
            fs.mkdirSync(path.dirname(target), { recursive: true });
            const text = fs.readFileSync(source, 'utf8');
            const ast = ts.createSourceFile(source, text, ts.ScriptTarget.Latest, true, source.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
            function audit(node) {
                if (ts.isCallExpression(node) && node.expression.getText(ast) === 't' && ts.isStringLiteral(node.arguments[0])) {
                    assert.ok(resources.ar[node.arguments[0].text], source + ': unlisted key ' + node.arguments[0].text);
                }
                if (ts.isJsxText(node)) assert.ok(!/[\u0600-\u06ff]/.test(node.text), source + ': untranslated JSX');
                ts.forEachChild(node, audit);
            }
            audit(ast);
            fs.writeFileSync(target, ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText);
        } else if (source.endsWith('.json')) {
            const target = path.join(workspace, relative);
            fs.mkdirSync(path.dirname(target), { recursive: true });
            fs.copyFileSync(source, target);
        }
    }
}
(async () => {
    try {
        compile(path.join(root, 'src'));
        const logo = path.join(workspace, 'public/logo/logo.png');
        fs.mkdirSync(path.dirname(logo), { recursive: true });
        fs.writeFileSync(logo, 'test asset');
        require.extensions['.png'] = (module) => { module.exports = '/logo/logo.png'; };
        const saved = new Map([['clinova.language', 'tr']]);
        global.localStorage = { getItem: (key) => saved.get(key), setItem: (key, value) => saved.set(key, value) };
        const { default: i18n, syncDocumentLanguage } = require(path.join(workspace, 'src/i18n/index.js'));
        assert.equal(i18n.language, 'tr', 'Restore saved language');
        const React = require('react');
        const { renderToStaticMarkup } = require('react-dom/server');
        const { ThemeProvider, createTheme } = require('@mui/material/styles');
        const { darkTheme } = require(path.join(workspace, 'src/theme/index.js'));
        const { default: App } = require(path.join(workspace, 'src/App.js'));
        global.document = { documentElement: { style: { setProperty() {} } } };
        for (const locale of locales) {
            await i18n.changeLanguage(locale);
            const direction = locale === 'ar' ? 'rtl' : 'ltr';
            assert.equal(document.documentElement.lang, locale);
            assert.equal(document.documentElement.dir, direction);
            assert.equal(saved.get('clinova.language'), locale);
            const html = renderToStaticMarkup(React.createElement(ThemeProvider, { theme: createTheme(darkTheme, { direction }) }, React.createElement(App)));
            const content = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, '').replace(/<[^>]*>/g, ' ');
            assert.ok(content.includes(resources[locale]['احجز موعدًا']), locale + ': booking CTA');
            assert.ok(content.includes(resources[locale]['استجابة فورية']), locale + ': revised journey');
            assert.ok(content.includes(resources[locale]['مناطق جغرافية']), locale + ': revised regions');
            assert.ok(html.includes('https://wa.me/905516886988'), locale + ': WhatsApp link');
            assert.ok(html.includes('https://clisis.novanoai.online/'), locale + ': CRM link');
            if (locale !== 'ar') { assert.ok(!/[\u0600-\u06ff]/.test(content), locale + ': Arabic text leaked'); }
            console.log(locale + ': complete translation, render, direction and links passed');
        }
        global.localStorage = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
        assert.doesNotThrow(() => syncDocumentLanguage('fr'), 'Blocked storage must not break switching');
        console.log(baseKeys.length + ' translation keys validated in all four locales');
    } finally {
        fs.rmSync(workspace, { recursive: true, force: true });
    }
})().catch((error) => { console.error(error); process.exitCode = 1; });
