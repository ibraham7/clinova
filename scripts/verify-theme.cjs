const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'src/theme/tokens.css'), 'utf8');
const modes = { dark: {}, light: {} };
for (const block of css.matchAll(/:root([^{}]*)\{([^}]+)\}/g)) {
    const target = block[1].includes('light') ? modes.light : modes.dark;
    for (const token of block[2].matchAll(/(--clinova-[\w-]+):\s*([^;]+);/g)) target[token[1]] = token[2];
}
const light = { ...modes.dark, ...modes.light };
const refs = new Set();
function audit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) audit(p);
        else if (/\.(tsx|css)$/.test(p)) {
            const source = fs.readFileSync(p, 'utf8');
            for (const match of source.matchAll(/var\((--clinova-(?:color|rgba|text|pointer|logo)[\w-]+)\)/g)) refs.add(match[1]);
        }
    }
}
audit(path.join(root, 'src'));
for (const token of refs) assert.ok(modes.dark[token] && light[token], 'Undefined theme token: ' + token);
function rgb(value, bg) {
    if (value.startsWith('#')) return [1,3,5].map(i => parseInt(value.slice(i,i+2),16));
    const channels = value.match(/[\d.]+/g).map(Number);
    return channels.slice(0,3).map((c,i) => c * channels[3] + bg[i] * (1-channels[3]));
}
function luminance(channels) {
    return channels.map(c => c/255).map(c => c <= .04045 ? c/12.92 : ((c+.055)/1.055)**2.4).reduce((n,c,i) => n + c*[.2126,.7152,.0722][i],0);
}
function contrast(a,b) { const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); }
const surfaces = ['#FFFFFF','#F6F8FC','#EEF2F8','#E3EBF7'];
const texts = Object.keys(light).filter(k => k.includes('text-') || k.includes('rgba-245-247-250') || ['--clinova-color-f5f7fa','--clinova-color-8ea8e8','--clinova-color-b8c8ef','--clinova-color-bdcef5','--clinova-color-dce6ff','--clinova-color-ffffff'].includes(k));
for (const token of texts) for (const surface of surfaces) {
    const bg=rgb(surface);const ratio=contrast(rgb(light[token],bg),bg);
    assert.ok(ratio >= 4.5, `${token} on ${surface}: ${ratio.toFixed(2)} below 4.5:1`);
}
for (const bg of ['#35558E','#3F5F9E','#4767A0']) assert.ok(contrast(rgb('#F6F8FC'),rgb(bg))>=4.5,'Light CTA contrast');
console.log(`${refs.size} theme references resolved; ${texts.length} light text colors pass 4.5:1 against four surfaces; CTA contrast passed`);
