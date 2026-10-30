# كيف تتأكد أن الكوكيز تعمل فعلًا (وليست مجرد بانر)

الفحص الحقيقي لا يعتمد على ما تراه على الشاشة، بل على **شيئين لا يكذبان**: الطلبات التي يرسلها المتصفح إلى Meta وGoogle وClarity، والكوكيز التي يحفظها فعلًا.

## الفحص اليدوي (دقيقتان)

1. افتح الموقع في نافذة **خفية** (Incognito) حتى لا تكون هناك كوكيز قديمة.
2. اضغط F12 ثم تبويب **Application** ثم **Cookies** ثم اسم الموقع.
3. **قبل أي ضغط على البانر:** يجب ألا تجد أي كوكي اسمها `_fbp` أو `_ga` أو `_gcl_au` أو `_clck`.
4. اضغط **قبول**، ثم اضغط زر التحديث بجانب قائمة الكوكيز. يجب أن تظهر `_fbp` و`_ga` أو `_gcl_au` و`_clck`.
5. من أسفل الصفحة اضغط **إعدادات الكوكيز** ثم **رفض**. تتحدث الصفحة وحدها، ويجب أن تختفي كل الكوكيز السابقة.
6. افتح تبويب **Network**، حدّث الصفحة، واكتب في الفلتر `facebook` ثم `gtag` ثم `clarity`. يجب أن تكون النتيجة فارغة بعد الرفض.

### فحص إضافي من الأدوات الرسمية
- إضافة **Meta Pixel Helper** (Chrome): لا تُظهر البكسل إلا بعد القبول.
- إضافة **Google Tag Assistant**: لا تُظهر `AW-18502054674` إلا بعد القبول.
- **Meta Events Manager** ثم **Test events**، و**Google Ads** ثم **Tag assistant**: تظهر زيارتك بعد القبول فقط.

## الفحص الآلي الكامل

السكربت `scripts/verify-consent.mjs` يعمل الخطوات أعلاه وأكثر (4 لغات، القبول، الرفض، تغيير الرأي، لوحة الإدارة، إشارة Global Privacy Control) ويطبع PASS أو FAIL لكل نقطة.

بدون إنترنت كامل (يستخدم أدوات وهمية بنفس أسماء الكوكيز، ويثبت منطق المنع والحذف):

```bash
npm i playwright
node scripts/verify-consent.mjs https://clinova.novanoai.online
```

**الفحص الحقيقي** بأدوات Meta وGoogle وClarity الفعلية وكوكيزها الحقيقية (يحتاج إنترنت عادي):

```bash
node scripts/verify-consent.mjs https://clinova.novanoai.online --live
```

على السيرفر بدون تثبيت Node:

```bash
docker run --rm --ipc=host -v /opt/clinova/landing-check:/t -w /t mcr.microsoft.com/playwright:v1.49.0-jammy \
  sh -c "cd /tmp && npm init -y >/dev/null && npm i playwright@1.49.0 >/dev/null && curl -fsSL https://raw.githubusercontent.com/ibraham7/clinova/main/scripts/verify-consent.mjs -o v.mjs && node v.mjs https://clinova.novanoai.online --live"
```

النتيجة المتوقعة: `RESULT: 24 passed, 0 failed`.

## ماذا يعني الفشل
- **FAIL قبل أي اختيار:** شيء يتتبع الزائر دون موافقته. يجب إصلاحه قبل الإعلانات.
- **FAIL بعد الرفض أو سحب الموافقة:** الكوكيز لا تُحذف أو الأدوات تعمل رغم الرفض.
- **FAIL بعد القبول:** الأدوات لا تعمل، فلن تُقاس الإعلانات.
