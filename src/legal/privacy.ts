import type { SiteLanguage } from "../i18n";

// The privacy policy, one text per language. It describes only what this site really does:
// the trial survey and the company-profile form (src/config/survey.json, netlify/functions/profile-lead.mjs),
// the cookie-free statistics (src/analytics/track.ts) and the tools that run after consent (src/analytics/consent.ts).
// Have it reviewed by a lawyer for each country you advertise in, and update `updated` when the text changes.
export type PrivacyText = { title: string; description: string; updated: string; sections: { heading: string; paragraphs: string[] }[] };

export const privacyUpdated = "2026-10-29";

export const privacy: Record<SiteLanguage, PrivacyText> = {
    ar: {
        title: "سياسة الخصوصية",
        description: "كيف يجمع موقع Clinova البيانات ويستخدمها ويحميها: النماذج، الإحصاءات بدون كوكيز، أدوات الإعلانات بعد موافقتك، وحقوقك.",
        updated: "آخر تحديث",
        sections: [
            { heading: "من نحن", paragraphs: ["هذا الموقع يخص Clinova، التي تقدم للعيادات خدمات التسويق وأنظمة إدارة المرضى. للتواصل بشأن الخصوصية استخدم وسائل التواصل في آخر هذه الصفحة."] },
            { heading: "ما الذي نجمعه", paragraphs: [
                "**ما تكتبه بنفسك:** عند تعبئة الاستبيان أو طلب ملف الشركة نحفظ وسيلة التواصل التي تختارها (البريد الإلكتروني أو رقم الهاتف)، وإجاباتك عن الاستبيان، ولغتك، وموافقتك أو رفضك لتلقي رسائل تسويقية.",
                "**إحصاءات الزيارة بدون كوكيز:** نعرف الصفحات التي فُتحت، والأقسام التي ظهرت، ومدى التمرير، والنقرات على الأزرار والروابط (اسم الزر فقط وليس ما تكتبه)، والبلد التقريبي. لا نحفظ عنوان IP، ونميّز الزيارة بقيمة مشفرة تتغير كل يوم.",
                "**أدوات الإعلانات والتحليل بعد موافقتك فقط:** Meta Pixel وGoogle Ads وMicrosoft Clarity. هذه الأدوات تستخدم كوكيز وقد تنقل بيانات إلى شركاتها، ولا تعمل إلا إذا ضغطت \"قبول\" في شريط الكوكيز.",
            ] },
            { heading: "لماذا نستخدم البيانات", paragraphs: ["للتواصل معك بشأن ما طلبته، ولتحسين الموقع، ولقياس نتائج الإعلانات. لا نبيع بياناتك، ولا نرسل رسائل تسويقية إلا إذا وافقت عليها."] },
            { heading: "أين تُحفظ ومن يصل إليها", paragraphs: ["تُحفظ بيانات النماذج والإحصاءات في قاعدة بيانات تستضيفها مزودات خدمة نتعامل معها (مثل Netlify وSupabase)، ولا يصل إليها إلا فريق Clinova المخوّل. أدوات Meta وGoogle وMicrosoft تخضع لسياسات الخصوصية الخاصة بها."] },
            { heading: "مدة الحفظ", paragraphs: ["نحتفظ ببيانات التواصل ما دامت لازمة للغرض الذي طلبته أو حتى تطلب حذفها، وتُحذف إحصاءات الزيارة بعد انتهاء الحاجة إليها."] },
            { heading: "خياراتك وحقوقك", paragraphs: [
                "يمكنك تغيير اختيارك للكوكيز في أي وقت من رابط \"إعدادات الكوكيز\" أسفل الموقع. ويحترم الموقع إشارة Global Privacy Control في متصفحك.",
                "يمكنك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها، أو سحب موافقتك على الرسائل التسويقية، بالتواصل معنا. وحسب بلدك قد تكون لك حقوق إضافية وفق قوانين مثل KVKK في تركيا أو GDPR في أوروبا.",
            ] },
            { heading: "التغييرات", paragraphs: ["قد نحدّث هذه السياسة، ونذكر تاريخ آخر تحديث أعلاها."] },
        ],
    },
    en: {
        title: "Privacy Policy",
        description: "How the Clinova website collects, uses and protects data: forms, cookie-free statistics, advertising tools only with your consent, and your rights.",
        updated: "Last updated",
        sections: [
            { heading: "Who we are", paragraphs: ["This website belongs to Clinova, which provides marketing services and patient-management systems for clinics. For privacy questions, use the contact details at the bottom of this page."] },
            { heading: "What we collect", paragraphs: [
                "**What you type yourself:** when you fill in the survey or request the company profile, we keep the contact method you choose (email or phone number), your survey answers, your language, and whether you agreed to receive marketing messages.",
                "**Cookie-free visit statistics:** which pages were opened, which sections appeared, how far you scrolled, clicks on buttons and links (the button's label only, never what you type), and the approximate country. We don't store your IP address, and we recognize a visit by an encrypted value that changes every day.",
                "**Advertising and analytics tools, only with your consent:** Meta Pixel, Google Ads and Microsoft Clarity. These tools use cookies and may send data to their companies, and they run only if you click \"Accept\" in the cookie banner.",
            ] },
            { heading: "Why we use data", paragraphs: ["To contact you about what you asked for, to improve the website and to measure advertising results. We don't sell your data, and we send marketing messages only if you agreed to them."] },
            { heading: "Where it is stored and who can access it", paragraphs: ["Form and statistics data are stored in a database hosted by service providers we work with (such as Netlify and Supabase), and only authorized Clinova staff can access it. The Meta, Google and Microsoft tools are covered by their own privacy policies."] },
            { heading: "How long we keep it", paragraphs: ["We keep contact data as long as it is needed for what you asked for or until you ask us to delete it, and visit statistics are deleted once they are no longer needed."] },
            { heading: "Your choices and rights", paragraphs: [
                "You can change your cookie choice at any time from the \"Cookie settings\" link at the bottom of the site. The site also respects your browser's Global Privacy Control signal.",
                "You can ask to see, correct or delete your data, or withdraw your consent to marketing messages, by contacting us. Depending on your country you may have additional rights under laws such as KVKK in Türkiye or the GDPR in Europe.",
            ] },
            { heading: "Changes", paragraphs: ["We may update this policy and will show the date of the latest update at the top."] },
        ],
    },
    tr: {
        title: "Gizlilik Politikası",
        description: "Clinova web sitesinin verileri nasıl topladığı, kullandığı ve koruduğu: formlar, çerezsiz istatistikler, yalnızca izninizle çalışan reklam araçları ve haklarınız.",
        updated: "Son güncelleme",
        sections: [
            { heading: "Biz kimiz", paragraphs: ["Bu web sitesi, kliniklere pazarlama hizmetleri ve hasta yönetim sistemleri sunan Clinova'ya aittir. Gizlilikle ilgili sorular için bu sayfanın altındaki iletişim bilgilerini kullanın."] },
            { heading: "Neleri topluyoruz", paragraphs: [
                "**Kendiniz yazdıklarınız:** anketi doldurduğunuzda ya da şirket profilini istediğinizde seçtiğiniz iletişim yolunu (e-posta veya telefon numarası), anket cevaplarınızı, dilinizi ve pazarlama mesajı almayı kabul edip etmediğinizi saklarız.",
                "**Çerezsiz ziyaret istatistikleri:** hangi sayfaların açıldığı, hangi bölümlerin göründüğü, ne kadar kaydırıldığı, düğme ve bağlantı tıklamaları (yalnızca düğmenin adı, yazdıklarınız asla) ve yaklaşık ülke. IP adresinizi saklamayız; ziyareti her gün değişen şifreli bir değerle tanırız.",
                "**Yalnızca izninizle çalışan reklam ve analiz araçları:** Meta Pixel, Google Ads ve Microsoft Clarity. Bu araçlar çerez kullanır ve verileri kendi şirketlerine gönderebilir; yalnızca çerez bandında \"Kabul et\"e tıklarsanız çalışır.",
            ] },
            { heading: "Verileri neden kullanıyoruz", paragraphs: ["İstediğiniz konuda sizinle iletişim kurmak, siteyi geliştirmek ve reklam sonuçlarını ölçmek için. Verilerinizi satmayız ve yalnızca kabul ettiyseniz pazarlama mesajı göndeririz."] },
            { heading: "Nerede saklanır ve kim erişebilir", paragraphs: ["Form ve istatistik verileri, çalıştığımız hizmet sağlayıcıların (Netlify ve Supabase gibi) barındırdığı bir veritabanında saklanır ve yalnızca yetkili Clinova ekibi erişebilir. Meta, Google ve Microsoft araçları kendi gizlilik politikalarına tabidir."] },
            { heading: "Ne kadar süre saklıyoruz", paragraphs: ["İletişim verilerini istediğiniz amaç için gerektiği sürece ya da silinmesini isteyene kadar saklarız; ziyaret istatistikleri artık gerekmediğinde silinir."] },
            { heading: "Seçimleriniz ve haklarınız", paragraphs: [
                "Çerez tercihinizi sitenin altındaki \"Çerez ayarları\" bağlantısından istediğiniz zaman değiştirebilirsiniz. Site, tarayıcınızın Global Privacy Control sinyaline de uyar.",
                "Bizimle iletişime geçerek verilerinizi görmeyi, düzeltmeyi veya silmeyi ya da pazarlama mesajlarına verdiğiniz izni geri çekmeyi isteyebilirsiniz. Ülkenize göre Türkiye'de KVKK veya Avrupa'da GDPR gibi yasalar kapsamında ek haklarınız olabilir.",
            ] },
            { heading: "Değişiklikler", paragraphs: ["Bu politikayı güncelleyebiliriz; son güncelleme tarihini sayfanın üstünde gösteririz."] },
        ],
    },
    fr: {
        title: "Politique de confidentialité",
        description: "Comment le site Clinova collecte, utilise et protège les données : formulaires, statistiques sans cookies, outils publicitaires uniquement avec votre accord, et vos droits.",
        updated: "Dernière mise à jour",
        sections: [
            { heading: "Qui sommes-nous", paragraphs: ["Ce site appartient à Clinova, qui propose aux cliniques des services marketing et des systèmes de gestion des patients. Pour toute question sur la confidentialité, utilisez les coordonnées en bas de cette page."] },
            { heading: "Ce que nous collectons", paragraphs: [
                "**Ce que vous saisissez vous-même :** lorsque vous remplissez le questionnaire ou demandez la présentation de l'entreprise, nous conservons le moyen de contact choisi (e-mail ou numéro de téléphone), vos réponses, votre langue et votre accord ou refus de recevoir des messages marketing.",
                "**Statistiques de visite sans cookies :** les pages ouvertes, les sections affichées, le défilement, les clics sur les boutons et les liens (seulement le libellé du bouton, jamais ce que vous saisissez) et le pays approximatif. Nous ne conservons pas votre adresse IP et reconnaissons une visite grâce à une valeur chiffrée qui change chaque jour.",
                "**Outils publicitaires et d'analyse, uniquement avec votre accord :** Meta Pixel, Google Ads et Microsoft Clarity. Ces outils utilisent des cookies et peuvent transmettre des données à leurs sociétés ; ils ne fonctionnent que si vous cliquez sur « Accepter » dans le bandeau cookies.",
            ] },
            { heading: "Pourquoi nous utilisons les données", paragraphs: ["Pour vous recontacter au sujet de votre demande, améliorer le site et mesurer les résultats publicitaires. Nous ne vendons pas vos données et n'envoyons des messages marketing que si vous les avez acceptés."] },
            { heading: "Où elles sont stockées et qui y accède", paragraphs: ["Les données des formulaires et des statistiques sont stockées dans une base hébergée par nos prestataires (comme Netlify et Supabase), et seule l'équipe Clinova autorisée y a accès. Les outils de Meta, Google et Microsoft relèvent de leurs propres politiques de confidentialité."] },
            { heading: "Durée de conservation", paragraphs: ["Nous conservons les coordonnées tant qu'elles sont nécessaires à votre demande ou jusqu'à ce que vous demandiez leur suppression ; les statistiques de visite sont supprimées lorsqu'elles ne sont plus utiles."] },
            { heading: "Vos choix et vos droits", paragraphs: [
                "Vous pouvez modifier votre choix concernant les cookies à tout moment via le lien « Paramètres des cookies » en bas du site. Le site respecte aussi le signal Global Privacy Control de votre navigateur.",
                "Vous pouvez demander à consulter, corriger ou supprimer vos données, ou retirer votre accord aux messages marketing, en nous contactant. Selon votre pays, vous pouvez disposer de droits supplémentaires au titre de lois comme le RGPD en Europe ou la KVKK en Turquie.",
            ] },
            { heading: "Modifications", paragraphs: ["Nous pouvons mettre à jour cette politique et indiquerons la date de la dernière mise à jour en haut de la page."] },
        ],
    },
};
