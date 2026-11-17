// Small copies of the site logo, made from public/logo/logo.png at the start of every build (and dev run), so a logo replaced in
// /admin is picked up automatically. The 2172 px original is 577 KB and was downloaded several times per visit; these are
// about 2x the size they are shown at. The original stays for the share images and the structured data.
import sharp from "sharp";
import fs from "node:fs";

const source = "public/logo/logo.png";
const targets = [
    ["public/logo/logo-s.webp", 440], // header, hero, loader, footer link, blog header
    ["public/logo/logo-m.webp", 880], // story card, the big faint footer wordmark
];
if (!fs.existsSync(source)) { console.log("build-logos: no logo found, skipped"); process.exit(0); }
const original = fs.statSync(source).mtimeMs;
for (const [file, width] of targets) {
    if (fs.existsSync(file) && fs.statSync(file).mtimeMs >= original) continue;
    await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: 82, alphaQuality: 90, effort: 5 }).toFile(file);
    console.log(`build-logos: ${file} ${(fs.statSync(file).size / 1024).toFixed(1)} KB`);
}
