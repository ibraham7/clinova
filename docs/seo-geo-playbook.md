# دليل SEO وGEO: ما نُفّذ على Clinova وكيف نكرره لأي عميل

**SEO** يعني أن يظهر الموقع في نتائج Google وBing. **GEO** (Generative Engine Optimization) يعني أن يذكره ChatGPT وGemini وPerplexity وCopilot عندما يسألهم أحد عن خدمة نقدمها. الأساس واحد في الحالتين: صفحات يقرؤها الزاحف بسهولة، ومحتوى مفيد وواضح، وثقة وسمعة خارج الموقع.

## 1. ما نُفّذ على موقع Clinova

### القاعدة التقنية

- **صفحات HTML جاهزة لكل لغة وكل مقال.** الموقع مبني بـ React، وزواحف الذكاء الاصطناعي (GPTBot وClaudeBot وPerplexityBot) لا تشغّل JavaScript، فكانت ترى صفحة شبه فارغة. الآن يولّد `npm run build` نسخة HTML كاملة لكل صفحة عبر `scripts/prerender.mjs`:
  - 4 صفحات رئيسية.
  - 4 صفحات للمدونة.
  - 32 مقالًا.
- **عنوان ووصف مستقلان لكل صفحة.**
  - الصفحة الرئيسية والمدونة: `src/seo/meta.ts`.
  - كل مقال: أعلى ملف المقال نفسه.
- **روابط اللغات (hreflang):** كل صفحة تربط نسخها الأربع ببعضها، والنسخة العربية هي الافتراضية.
- **رابط canonical لكل صفحة:** يمنع ظهور الصفحة نفسها مرتين في Google.
- **معاينة المشاركة (Open Graph وTwitter Card):** عنوان ووصف وصورة لكل لغة في `public/og/`، تظهر عند مشاركة الرابط على WhatsApp وFacebook وLinkedIn وX.
- **بيانات منظمة (Schema.org JSON-LD):**
  - `Organization` تصف الخدمات السبع والدول ووسائل التواصل.
  - `WebSite`.
  - `FAQPage` من الأسئلة الشائعة.
  - في كل مقال: `BlogPosting` و`BreadcrumbList` و`FAQPage`.
- **`sitemap.xml`** فيه كل الروابط مع اللغات البديلة وتاريخ آخر تعديل.
- **`robots.txt`** يسمح صراحةً لمحركات البحث وزواحف الذكاء الاصطناعي، مثل OAI-SearchBot لظهور الموقع في بحث ChatGPT، وPerplexityBot وClaudeBot وGoogle-Extended.
- **`llms.txt`:** ملخص نصي عن Clinova وخدماتها وروابط المقالات. يساعد بعض الأدوات، وGoogle لا يحتاجه.
- **IndexNow:** الأمر `npm run indexnow` يبلغ Bing فورًا بكل الروابط بعد النشر. Bing مهم لظهور الموقع في Copilot، ويُرجَّح أن ChatGPT يستفيد من فهرسه، مع أن ذلك غير مؤكد رسميًا.
- **أماكن رموز التحقق:** خانتا رمز Google Search Console ورمز Bing Webmaster جاهزتان في `src/seo/site.ts`.

### المدونة

- **الروابط:** `/ar/blog` و`/en/blog` و`/tr/blog` و`/fr/blog`.
- **الوصول إليها:** ليست في قائمة الهيدر. يوجد رابط صغير واحد في الفوتر باسم "المدونة"، لأن محركات البحث تعتمد على الروابط الداخلية لاكتشاف الصفحات وتقدير أهميتها. حذف هذا الرابط يضعف أرشفة المقالات، وإن لم يمنعها بسبب `sitemap.xml`.
- **المحتوى:** 8 مقالات بأربع لغات، كل مقال مبني على خدمة من خدمات Clinova:

| المقال | الرابط |
|---|---|
| جذب المرضى عبر Google وMeta وSEO | `clinic-patient-acquisition` |
| نظام CRM للعيادات | `clinic-crm-system` |
| الرد عبر WhatsApp بالذكاء الاصطناعي | `whatsapp-ai-for-clinics` |
| تحويل الاستفسارات إلى حجوزات | `turn-inquiries-into-bookings` |
| منسق العلاج وفريق المبيعات | `treatment-coordinator` |
| إعادة تنشيط المرضى القدامى | `reactivate-past-patients` |
| التقييمات والسمعة | `clinic-reviews-reputation` |
| تسويق عيادات الأسنان | `dental-clinic-marketing` |

- **بنية كل مقال:** مصممة لتسهّل على Google وأدوات الذكاء الاصطناعي اقتباس المقال:
  - خلاصة في البداية تجيب عن السؤال مباشرة.
  - عناوين واضحة.
  - قوائم وخطوات.
  - أسئلة شائعة في النهاية.
  - روابط داخلية بين المقالات وإلى الصفحة الرئيسية.
- **لا أرقام مخترعة:** المقالات لا تحتوي إحصاءات أو نتائج غير موثقة. سياسات Google ضد "المحتوى المنتج بكثرة لغرض الترتيب" (scaled content abuse) تعاقب المحتوى الضعيف والمكرر، لذلك اخترنا مقالات قليلة ومفيدة بدل عدد كبير.

### كيف تضيف مقالًا جديدًا

1. أنشئ مجلدًا باسم الرابط داخل `src/blog/content/`، مثل `src/blog/content/hair-transplant-marketing/`.
2. أضف ملفًا لكل لغة: `ar.md` و`en.md` و`tr.md` و`fr.md`. ليس شرطًا أن تكتب كل اللغات.
3. ابدأ كل ملف بهذا الرأس:

```
---
title: العنوان الكامل الذي يظهر في الصفحة
seoTitle: عنوان أقصر (أقل من 60 حرفًا) لنتائج البحث، اختياري
description: وصف بين 120 و160 حرفًا يظهر تحت العنوان في Google
date: 2026-11-01
---
```

4. استخدم هذه الصيغة في نص المقال:

| الصيغة | معناها |
|---|---|
| `> ` | الخلاصة في أول المقال |
| `## ` | عنوان قسم |
| `- ` أو `1. ` | قائمة |
| `**نص**` | نص عريض |
| `[نص](/ar/blog/slug)` | رابط |
| `Q:` ثم `A:` | سؤال شائع وجوابه |

5. ارفع التعديل على GitHub. البناء يولّد الصفحة ويضيفها إلى sitemap وllms.txt تلقائيًا.

## 2. ما يجب فعله بعد النشر (مرة واحدة)

1. **Google Search Console** على search.google.com/search-console:
   - أضف `https://clinova.novanoai.online` كـ URL prefix.
   - تحقّق من الملكية:
     - **عبر DNS:** أفضل طريقة.
     - **عبر وسم HTML:** ضع الرمز في `googleSiteVerification` داخل `src/seo/site.ts`.
   - أرسل `https://clinova.novanoai.online/sitemap.xml` من قسم Sitemaps.
2. **Bing Webmaster Tools** على bing.com/webmasters:
   - استورد الموقع من Search Console مباشرة، أو تحقّق عبر `bingSiteVerification`.
   - أرسل الـ sitemap.
3. **IndexNow:** بعد كل نشر مهم شغّل `npm run indexnow`.
4. **Google Business Profile:** أنشئ ملفًا لـ Clinova بعنوان حقيقي وساعات عمل وصور، واربطه بالموقع. هذا أهم عامل للظهور المحلي وفي إجابات الذكاء الاصطناعي عن "أفضل وكالة تسويق للعيادات في …".
5. **الاختبار:**
   - **البيانات المنظمة:** validator.schema.org وأداة Rich Results Test من Google.
   - **معاينة المشاركة:** أداة Facebook Sharing Debugger وأداة LinkedIn Post Inspector.
   - **ما يراه الزاحف:** `curl -A "GPTBot" https://clinova.novanoai.online/ar/blog/clinic-crm-system` يجب أن يُظهر نص المقال كاملًا.

## 3. خارج الموقع: ما يصنع الفرق الأكبر في GEO

أدوات الذكاء الاصطناعي تعتمد على ما يقوله الإنترنت عنك، لا على موقعك فقط:

- **حسابات متطابقة:** نفس الاسم والوصف ورقم التواصل في LinkedIn وInstagram وFacebook وGoogle Business Profile. وأضف روابطها إلى `socialProfiles` في `src/seo/site.ts`.
- **صفحة شركة على LinkedIn** بوصف واضح للخدمات.
- **ذِكر في مواقع أخرى:** مقالات ضيف في مواقع طبية أو تسويقية، ومقابلات، ودراسات حالة مع عيادات حقيقية تذكر Clinova بالاسم ورابط.
- **أدلة الشركات** ومنصات مثل Clutch للوكالات.
- **تقييمات حقيقية** على Google من عملاء Clinova، أي العيادات نفسها.
- **فيديوهات YouTube** قصيرة تشرح الخدمات. YouTube مصدر شائع في إجابات Gemini وAI Overviews.

## 4. التوقعات والقياس

- **متى تظهر النتائج:** عادة بين 2 و6 أشهر، حسب المنافسة واللغة. لا أحد يستطيع أن يضمن المركز الأول في Google أو الذكر في ChatGPT. ما نضمنه هو أن الموقع صار جاهزًا تقنيًا وفيه محتوى يستحق الظهور.
- **ما نقيسه شهريًا:**
  - **من Search Console:** مرات الظهور والنقرات ومتوسط الترتيب لكل كلمة، والصفحات المؤرشفة.
  - **من Bing Webmaster:** الأرقام نفسها في Bing، إضافة إلى تقرير AI Performance إن توفر.
  - **اختبار يدوي:** نسأل ChatGPT وPerplexity وGemini أسئلة مثل "ما أفضل نظام CRM للعيادات في تركيا؟"، ونسجل إن ذُكرت Clinova.
  - **من Microsoft Clarity** (مثبت على الموقع): كيف يتصرف الزوار.
- **الاستمرار:** مقالان إلى أربعة شهريًا تجيب عن أسئلة يطرحها المرضى أو أصحاب العيادات فعلًا، مع تحديث المقالات القديمة.

## 5. قائمة تطبيق جاهزة لأي عميل

استخدم هذه القائمة عند بيع خدمة SEO وGEO مع موقع جديد:

**التقنية**
- [ ] كل صفحة تصل إلى الزاحف كـ HTML كامل: SSR أو prerender، وليس SPA فارغًا.
- [ ] عنوان فريد (حتى 60 حرفًا) ووصف فريد (120 إلى 160 حرفًا) لكل صفحة.
- [ ] canonical وhreflang للمواقع متعددة اللغات.
- [ ] Open Graph وTwitter Card مع صورة 1200×630 لكل لغة.
- [ ] JSON-LD: Organization أو LocalBusiness مع العنوان الحقيقي، وService، وFAQPage، وBreadcrumbList، وArticle.
- [ ] sitemap.xml وrobots.txt يسمح لزواحف البحث والذكاء الاصطناعي، وllms.txt.
- [ ] عنوان H1 واحد لكل صفحة، وعناوين مرتبة، ونص بديل للصور.
- [ ] سرعة جيدة على الجوال؛ اختبرها في PageSpeed Insights.
- [ ] Search Console وBing Webmaster وIndexNow.

**المحتوى**
- [ ] صفحة لكل خدمة تجيب عن أسئلة العميل الحقيقية.
- [ ] مدونة بمقالات مفيدة: خلاصة في البداية، وعناوين واضحة، وأسئلة شائعة.
- [ ] لا أرقام أو تقييمات أو شهادات مخترعة.

**خارج الموقع**
- [ ] Google Business Profile مكتمل.
- [ ] حسابات اجتماعية بمعلومات متطابقة.
- [ ] خطة لجمع تقييمات حقيقية وذكر في مواقع أخرى.

**اقتراح لتسعير الخدمة:** باقة إعداد لمرة واحدة تشمل القسم التقني والمحتوى الأولي، ثم اشتراك شهري اختياري للمحتوى والمتابعة والتقارير. الاشتراك الشهري هو ما يصنع النتائج على المدى الطويل.

## المصادر

- OpenAI: إعداد OAI-SearchBot لظهور الموقع في بحث ChatGPT: https://developers.openai.com/docs/bots
- Vercel وMERJ عن عدم تشغيل زواحف الذكاء الاصطناعي لـ JavaScript، كما لخّصه: https://searchoptimo.com/blog/do-ai-crawlers-render-javascript
- سياسة Google ضد المحتوى المنتج بكثرة (scaled content abuse): https://ppc.land/scaled-content-abuse/
- توقف Google عن عرض نتائج FAQ المنسقة في 2026، مع بقاء بيانات FAQPage صالحة: https://www.searchenginejournal.com/google-drops-faq-rich-results/574429/
- ممارسات GEO في 2026: https://aisearch.similarweb.com/blog/what-is-geo/
- IndexNow: https://www.indexnow.org
