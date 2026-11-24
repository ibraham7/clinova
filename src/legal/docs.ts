import type { SiteLanguage } from "../i18n";
import type { PrivacyText } from "./privacy";

// The other legal pages every Turkish payment provider (iyzico) asks a seller to publish:
// About us, Delivery and Returns, and the Distance Sales Agreement (Mesafeli Satış Sözleşmesi).
// The seller's name, address and tax details come from ./company.ts and are printed under each page.
// These are drafts that describe how Clinova works (digital services, delivered online); have a lawyer review them and
// update `legalUpdated` when the text changes.
export type LegalSlug = "about" | "delivery-returns" | "distance-sales";
export const legalSlugs: LegalSlug[] = ["about", "delivery-returns", "distance-sales"];
export const legalUpdated = "2026-11-24";

export const legalDocs: Record<LegalSlug, Record<SiteLanguage, PrivacyText>> = {
    about: {
        ar: {
            title: "من نحن",
            description: "Clinova تقدّم للعيادات خدمات التسويق وأنظمة إدارة المرضى: تعرّف على ما نفعله ولمن وكيف نعمل.",
            updated: "آخر تحديث",
            sections: [
                { heading: "من نحن", paragraphs: ["Clinova شركة تقنية تساعد العيادات الطبية وعيادات الأسنان على الوصول إلى مرضى جدد، وعلى إدارة مرضاها ومواعيدها ورسائلها في مكان واحد. نعمل مع عيادات في تركيا والعالم العربي."] },
                { heading: "ماذا نقدّم", paragraphs: [
                    "**التسويق للعيادات:** حملات إعلانية وصفحات هبوط ومحتوى بعدة لغات لجذب المرضى.",
                    "**نظام إدارة العيادة:** ملفات المرضى، المواعيد والتقويم، رسائل واتساب التلقائية (تأكيد وتذكير ومتابعة)، الفواتير والتقارير.",
                    "**المساعدة الذكية:** ردود سريعة على استفسارات المرضى وحجز المواعيد على مدار الساعة.",
                ] },
                { heading: "كيف نعمل", paragraphs: ["جميع خدماتنا رقمية وتُقدَّم عبر الإنترنت، فلا شحن ولا منتجات مادية. نبدأ بفهم عيادتك وأهدافك، ثم نضبط الخدمة، ونتابع النتائج معك. تُدفع الخدمات بالبطاقة عبر iyzico، وهي مؤسسة دفع مرخّصة في تركيا، ولا نحتفظ بأرقام بطاقاتك."] },
                { heading: "تواصل معنا", paragraphs: ["يسعدنا أن نسمع منك. بيانات التواصل وبيانات الشركة في أسفل هذه الصفحة."] },
            ],
        },
        en: {
            title: "About Us",
            description: "Clinova provides marketing services and patient-management systems for clinics: what we do, who for, and how we work.",
            updated: "Last updated",
            sections: [
                { heading: "Who we are", paragraphs: ["Clinova is a technology company that helps medical and dental clinics reach new patients and manage their patients, appointments and messages in one place. We work with clinics in Türkiye and the Arab world."] },
                { heading: "What we offer", paragraphs: [
                    "**Marketing for clinics:** advertising campaigns, landing pages and multilingual content that bring in patients.",
                    "**Clinic management system:** patient files, appointments and calendar, automatic WhatsApp messages (confirmations, reminders, follow-ups), invoices and reports.",
                    "**Smart assistant:** fast answers to patient questions and appointment booking around the clock.",
                ] },
                { heading: "How we work", paragraphs: ["All our services are digital and delivered online, so there is no shipping and no physical product. We start by understanding your clinic and goals, set the service up, and follow the results with you. Services are paid by card through iyzico, a licensed payment institution in Türkiye, and we never store your card numbers."] },
                { heading: "Contact us", paragraphs: ["We'd be glad to hear from you. Contact and company details are at the bottom of this page."] },
            ],
        },
        tr: {
            title: "Hakkımızda",
            description: "Clinova, kliniklere pazarlama hizmetleri ve hasta yönetim sistemleri sunar: ne yaptığımız, kimler için çalıştığımız ve nasıl çalıştığımız.",
            updated: "Son güncelleme",
            sections: [
                { heading: "Biz kimiz", paragraphs: ["Clinova, tıp ve diş kliniklerinin yeni hastalara ulaşmasına, hastalarını, randevularını ve mesajlarını tek bir yerden yönetmesine yardımcı olan bir teknoloji şirketidir. Türkiye'de ve Arap dünyasındaki kliniklerle çalışıyoruz."] },
                { heading: "Neler sunuyoruz", paragraphs: [
                    "**Klinikler için pazarlama:** hasta kazandıran reklam kampanyaları, açılış sayfaları ve çok dilli içerik.",
                    "**Klinik yönetim sistemi:** hasta dosyaları, randevular ve takvim, otomatik WhatsApp mesajları (onay, hatırlatma, takip), faturalar ve raporlar.",
                    "**Akıllı asistan:** hasta sorularına hızlı yanıt ve gün boyu randevu alma.",
                ] },
                { heading: "Nasıl çalışıyoruz", paragraphs: ["Tüm hizmetlerimiz dijitaldir ve internet üzerinden sunulur; fiziksel ürün ve kargo yoktur. Önce kliniğinizi ve hedeflerinizi anlarız, hizmeti kurarız ve sonuçları sizinle birlikte takip ederiz. Hizmet bedelleri, Türkiye'de lisanslı bir ödeme kuruluşu olan iyzico ile kartla ödenir; kart numaralarınızı saklamayız."] },
                { heading: "Bize ulaşın", paragraphs: ["Sizden haber almaktan memnuniyet duyarız. İletişim ve şirket bilgileri bu sayfanın altındadır."] },
            ],
        },
        fr: {
            title: "À propos",
            description: "Clinova propose aux cliniques des services marketing et des systèmes de gestion des patients : ce que nous faisons, pour qui et comment.",
            updated: "Dernière mise à jour",
            sections: [
                { heading: "Qui sommes-nous", paragraphs: ["Clinova est une entreprise technologique qui aide les cliniques médicales et dentaires à attirer de nouveaux patients et à gérer patients, rendez-vous et messages en un seul endroit. Nous travaillons avec des cliniques en Turquie et dans le monde arabe."] },
                { heading: "Ce que nous proposons", paragraphs: [
                    "**Marketing pour cliniques :** campagnes publicitaires, pages d'atterrissage et contenus multilingues qui attirent des patients.",
                    "**Système de gestion de clinique :** dossiers patients, rendez-vous et agenda, messages WhatsApp automatiques (confirmation, rappel, suivi), factures et rapports.",
                    "**Assistant intelligent :** réponses rapides aux questions des patients et prise de rendez-vous à toute heure.",
                ] },
                { heading: "Comment nous travaillons", paragraphs: ["Tous nos services sont numériques et fournis en ligne : pas d'expédition ni de produit physique. Nous commençons par comprendre votre clinique et vos objectifs, mettons le service en place et suivons les résultats avec vous. Les services se paient par carte via iyzico, établissement de paiement agréé en Turquie, et nous ne conservons jamais vos numéros de carte."] },
                { heading: "Nous contacter", paragraphs: ["Nous serons heureux de vous lire. Les coordonnées et les informations de la société figurent en bas de cette page."] },
            ],
        },
    },

    "delivery-returns": {
        ar: {
            title: "شروط التسليم والإرجاع",
            description: "كيف تُسلَّم خدمات Clinova الرقمية، ومتى يمكن إلغاؤها أو استرداد المبلغ، وكيف نعيد المال.",
            updated: "آخر تحديث",
            sections: [
                { heading: "طبيعة الخدمات", paragraphs: ["خدمات Clinova رقمية بالكامل (تسويق، نظام إدارة العيادة، مساعد ذكي). لا يوجد منتج مادي، لذلك لا يوجد شحن ولا رسوم توصيل."] },
                { heading: "التسليم", paragraphs: [
                    "بعد تأكيد الدفع نرسل إليك رسالة تأكيد على بريدك أو هاتفك، ونتواصل معك لبدء التنفيذ.",
                    "يتم تفعيل حساب النظام أو بدء العمل عادةً خلال يوم عمل واحد إلى ثلاثة أيام عمل من تأكيد الدفع، حسب نوع الخدمة، ونخبرك بالموعد المحدد عند الطلب.",
                    "تصلك الفاتورة وبيانات الدخول عبر الوسيلة التي زودتنا بها.",
                ] },
                { heading: "الإلغاء والاسترداد", paragraphs: [
                    "**قبل بدء الخدمة:** يمكنك إلغاء طلبك واسترداد المبلغ كاملًا خلال 14 يومًا من الدفع، ما دام العمل لم يبدأ.",
                    "**بعد بدء الخدمة:** تُقدَّم الخدمة الرقمية بناءً على طلبك، وببدء تنفيذها بموافقتك تنتهي مدة حق العدول بحسب لائحة العقود عن بعد في تركيا. ومع ذلك نراجع كل طلب بإنصاف، وإذا لم تُقدَّم الخدمة كما وُصفت نرد لك المبلغ عن الجزء غير المقدَّم.",
                    "**الاشتراكات الشهرية:** يمكنك إيقاف التجديد في أي وقت، فيستمر الاشتراك حتى نهاية المدة المدفوعة ولا يُجدَّد بعدها.",
                ] },
                { heading: "طريقة رد المبلغ", paragraphs: ["يُرد المبلغ إلى البطاقة نفسها التي تم الدفع بها عبر iyzico خلال 14 يومًا من قبول طلب الاسترداد، وقد يستغرق ظهوره في كشف حسابك مدة إضافية حسب البنك."] },
                { heading: "كيف تطلب الإلغاء أو الاسترداد", paragraphs: ["راسلنا على البريد أو الهاتف المذكورَين في أسفل الصفحة مع ذكر اسمك وطريقة الدفع وتاريخه، ونرد عليك خلال يومي عمل."] },
            ],
        },
        en: {
            title: "Delivery and Return Terms",
            description: "How Clinova's digital services are delivered, when they can be cancelled or refunded, and how refunds are paid.",
            updated: "Last updated",
            sections: [
                { heading: "Nature of the services", paragraphs: ["Clinova's services are entirely digital (marketing, the clinic management system, the smart assistant). There is no physical product, so there is no shipping and no delivery fee."] },
                { heading: "Delivery", paragraphs: [
                    "After the payment is confirmed we send a confirmation to your email or phone and contact you to start.",
                    "Your system account is activated, or work begins, usually within one to three working days of payment confirmation, depending on the service. We tell you the exact date when you order.",
                    "The invoice and access details reach you by the contact method you gave us.",
                ] },
                { heading: "Cancellation and refunds", paragraphs: [
                    "**Before the service starts:** you can cancel your order and get a full refund within 14 days of payment, as long as work has not begun.",
                    "**After the service starts:** a digital service is provided at your request, and once it begins with your consent, the right of withdrawal ends under Türkiye's Distance Contracts Regulation. We still review every request fairly, and if the service was not delivered as described we refund the part that was not provided.",
                    "**Monthly subscriptions:** you can stop renewal at any time. The subscription then runs until the end of the paid period and does not renew.",
                ] },
                { heading: "How refunds are paid", paragraphs: ["Refunds go back to the same card used for the payment through iyzico within 14 days of approving the request. It may take longer to appear on your statement, depending on your bank."] },
                { heading: "How to ask for cancellation or a refund", paragraphs: ["Write to the email or call the phone number at the bottom of this page, with your name and the payment method and date. We reply within two working days."] },
            ],
        },
        tr: {
            title: "Teslimat ve İade Şartları",
            description: "Clinova'nın dijital hizmetlerinin nasıl teslim edildiği, ne zaman iptal edilebileceği veya iade alınabileceği ve iadenin nasıl yapıldığı.",
            updated: "Son güncelleme",
            sections: [
                { heading: "Hizmetin niteliği", paragraphs: ["Clinova'nın hizmetleri tamamen dijitaldir (pazarlama, klinik yönetim sistemi, akıllı asistan). Fiziksel ürün olmadığından kargo ve teslimat ücreti yoktur."] },
                { heading: "Teslimat", paragraphs: [
                    "Ödeme onaylandıktan sonra e-postanıza veya telefonunuza bir onay mesajı gönderir ve başlamak için sizinle iletişime geçeriz.",
                    "Sistem hesabınız ya da çalışma, hizmete göre ödeme onayından sonraki bir ila üç iş günü içinde etkinleştirilir. Sipariş sırasında kesin tarihi bildiririz.",
                    "Fatura ve erişim bilgileri, bize verdiğiniz iletişim yoluyla size ulaştırılır.",
                ] },
                { heading: "İptal ve iade", paragraphs: [
                    "**Hizmet başlamadan önce:** çalışma başlamamışsa, ödemeden itibaren 14 gün içinde siparişinizi iptal edip bedelin tamamını geri alabilirsiniz.",
                    "**Hizmet başladıktan sonra:** dijital hizmet talebiniz üzerine sunulur; onayınızla ifasına başlandığında, Mesafeli Sözleşmeler Yönetmeliği uyarınca cayma hakkı sona erer. Yine de her talebi hakkaniyetle değerlendiririz; hizmet tarif edildiği gibi sunulmadıysa sunulmayan kısmın bedelini iade ederiz.",
                    "**Aylık abonelikler:** yenilemeyi istediğiniz zaman durdurabilirsiniz. Abonelik ödenen dönemin sonuna kadar sürer ve yenilenmez.",
                ] },
                { heading: "İadenin yapılışı", paragraphs: ["İadeler, talebin onaylanmasından itibaren 14 gün içinde iyzico üzerinden ödemede kullanılan karta yapılır. Bankanıza bağlı olarak ekstrenize yansıması daha uzun sürebilir."] },
                { heading: "İptal veya iade nasıl istenir", paragraphs: ["Bu sayfanın altındaki e-posta adresine yazın veya telefonla arayın; adınızı, ödeme yöntemini ve tarihini belirtin. İki iş günü içinde yanıt veririz."] },
            ],
        },
        fr: {
            title: "Conditions de livraison et de retour",
            description: "Comment les services numériques de Clinova sont fournis, quand ils peuvent être annulés ou remboursés et comment le remboursement est effectué.",
            updated: "Dernière mise à jour",
            sections: [
                { heading: "Nature des services", paragraphs: ["Les services de Clinova sont entièrement numériques (marketing, système de gestion de clinique, assistant intelligent). Il n'y a aucun produit physique : pas d'expédition ni de frais de livraison."] },
                { heading: "Livraison", paragraphs: [
                    "Après confirmation du paiement, nous envoyons une confirmation par e-mail ou téléphone et vous contactons pour démarrer.",
                    "Votre compte est activé, ou le travail commence, en général sous un à trois jours ouvrés après la confirmation du paiement, selon le service. Nous vous indiquons la date exacte à la commande.",
                    "La facture et les accès vous parviennent par le moyen de contact que vous nous avez donné.",
                ] },
                { heading: "Annulation et remboursement", paragraphs: [
                    "**Avant le début du service :** vous pouvez annuler votre commande et obtenir un remboursement intégral dans les 14 jours suivant le paiement, tant que le travail n'a pas commencé.",
                    "**Après le début du service :** un service numérique est fourni à votre demande ; dès que son exécution commence avec votre accord, le droit de rétractation prend fin selon le règlement turc sur les contrats à distance. Nous examinons néanmoins chaque demande avec équité et, si le service n'a pas été fourni comme décrit, nous remboursons la partie non fournie.",
                    "**Abonnements mensuels :** vous pouvez arrêter le renouvellement à tout moment ; l'abonnement court jusqu'à la fin de la période payée et ne se renouvelle pas.",
                ] },
                { heading: "Modalités de remboursement", paragraphs: ["Le remboursement est effectué sur la carte utilisée pour le paiement, via iyzico, dans les 14 jours suivant l'acceptation de la demande. Selon votre banque, il peut apparaître plus tard sur votre relevé."] },
                { heading: "Comment demander l'annulation ou le remboursement", paragraphs: ["Écrivez à l'adresse e-mail ou appelez le numéro indiqués en bas de page, avec votre nom, le moyen de paiement et la date. Nous répondons sous deux jours ouvrés."] },
            ],
        },
    },

    "distance-sales": {
        ar: {
            title: "اتفاقية البيع عن بُعد",
            description: "اتفاقية البيع عن بُعد لخدمات Clinova الرقمية: الأطراف، موضوع العقد، الدفع، التنفيذ، حق العدول وحل النزاعات.",
            updated: "آخر تحديث",
            sections: [
                { heading: "1. الأطراف", paragraphs: ["**البائع:** Clinova، وبياناته في أسفل هذه الصفحة. **المشتري:** الشخص أو العيادة التي تُكمل الطلب وتُدخل بياناتها عند الشراء. بإتمام الطلب يقرّ المشتري بأنه قرأ هذه الاتفاقية ووافق عليها."] },
                { heading: "2. موضوع العقد", paragraphs: ["تحديد حقوق الطرفين والتزاماتهما في بيع الخدمات الرقمية التي يطلبها المشتري من موقع Clinova عن بُعد، وفق قانون حماية المستهلك رقم 6502 ولائحة العقود عن بعد في تركيا."] },
                { heading: "3. الخدمة والسعر", paragraphs: ["الخدمة وصفها ومدتها وسعرها وعملتها مذكورة في العرض أو صفحة الطلب قبل الدفع، وهي جزء من هذه الاتفاقية. الأسعار شاملة الضرائب ما لم يُذكر غير ذلك. لا توجد رسوم شحن لأن الخدمة رقمية."] },
                { heading: "4. الدفع", paragraphs: ["يتم الدفع بالبطاقة المصرفية (Visa وMastercard وغيرها) عبر مؤسسة الدفع المرخّصة iyzico. لا يطّلع البائع على رقم بطاقتك ولا يحتفظ به."] },
                { heading: "5. التنفيذ والتسليم", paragraphs: ["تُقدَّم الخدمة إلكترونيًا بعد تأكيد الدفع خلال المدة المذكورة في صفحة \"شروط التسليم والإرجاع\". ويلتزم المشتري بتزويد البائع بالمعلومات والصلاحيات اللازمة للتنفيذ."] },
                { heading: "6. حق العدول والاسترداد", paragraphs: ["يحق للمشتري العدول عن الطلب خلال 14 يومًا من الدفع دون إبداء سبب، ما دام تنفيذ الخدمة لم يبدأ. وإذا بدأ تنفيذ الخدمة الرقمية بموافقة المشتري قبل انتهاء المدة، يسقط حق العدول وفق لائحة العقود عن بعد. تفاصيل الإلغاء والاسترداد في صفحة \"شروط التسليم والإرجاع\"، ويُرد المبلغ إلى البطاقة نفسها."] },
                { heading: "7. المسؤولية", paragraphs: ["يلتزم البائع بتقديم الخدمة بالمواصفات المذكورة. ولا يتحمل مسؤولية التأخير أو الانقطاع الناتج عن قوة قاهرة أو أعطال خارجة عن إرادته لدى مزودي الإنترنت أو الدفع أو واتساب."] },
                { heading: "8. حماية البيانات", paragraphs: ["تُعالَج بيانات المشتري وفق سياسة الخصوصية المنشورة على الموقع، ووفق قانون حماية البيانات الشخصية رقم 6698 (KVKK)."] },
                { heading: "9. حل النزاعات", paragraphs: ["تُطبَّق قوانين جمهورية تركيا. وللمشتري التقدم بشكواه إلى لجان التحكيم لدى المستهلك أو محاكم المستهلك في محل إقامته ضمن الحدود المالية المقررة قانونًا."] },
                { heading: "10. بدء السريان", paragraphs: ["تُعد الاتفاقية مبرمة عند إتمام المشتري الطلب والدفع، وتُرسل نسخة منها إلى بريده أو هاتفه عند الطلب."] },
            ],
        },
        en: {
            title: "Distance Sales Agreement",
            description: "The distance sales agreement for Clinova's digital services: parties, subject, payment, performance, right of withdrawal and disputes.",
            updated: "Last updated",
            sections: [
                { heading: "1. Parties", paragraphs: ["**Seller:** Clinova, whose details are at the bottom of this page. **Buyer:** the person or clinic that completes the order and enters their details at checkout. By completing the order the buyer confirms having read and accepted this agreement."] },
                { heading: "2. Subject", paragraphs: ["This agreement sets the rights and duties of both parties in the sale, at a distance, of the digital services the buyer orders from the Clinova website, under Türkiye's Consumer Protection Law no. 6502 and the Distance Contracts Regulation."] },
                { heading: "3. Service and price", paragraphs: ["The service, its description, term, price and currency are stated in the offer or the order page before payment and form part of this agreement. Prices include taxes unless stated otherwise. There is no shipping fee because the service is digital."] },
                { heading: "4. Payment", paragraphs: ["Payment is made by bank card (Visa, Mastercard and others) through the licensed payment institution iyzico. The seller never sees or stores your card number."] },
                { heading: "5. Performance and delivery", paragraphs: ["The service is provided electronically after payment is confirmed, within the time stated on the \"Delivery and Return Terms\" page. The buyer provides the information and access the seller needs to perform it."] },
                { heading: "6. Right of withdrawal and refunds", paragraphs: ["The buyer may withdraw from the order within 14 days of payment without giving a reason, as long as performance of the service has not begun. If performance of the digital service begins with the buyer's consent before that period ends, the right of withdrawal ends under the Distance Contracts Regulation. Details on cancellation and refunds are on the \"Delivery and Return Terms\" page, and the refund goes back to the same card."] },
                { heading: "7. Liability", paragraphs: ["The seller provides the service as described. The seller is not liable for delay or interruption caused by force majeure or by faults beyond its control at internet, payment or WhatsApp providers."] },
                { heading: "8. Data protection", paragraphs: ["The buyer's data is processed under the privacy policy published on the site and under Law no. 6698 on the Protection of Personal Data (KVKK)."] },
                { heading: "9. Disputes", paragraphs: ["The laws of the Republic of Türkiye apply. The buyer may bring a complaint to the consumer arbitration committees or consumer courts where they live, within the monetary limits set by law."] },
                { heading: "10. Entry into force", paragraphs: ["The agreement is concluded when the buyer completes the order and the payment, and a copy is sent to their email or phone on request."] },
            ],
        },
        tr: {
            title: "Mesafeli Satış Sözleşmesi",
            description: "Clinova'nın dijital hizmetleri için mesafeli satış sözleşmesi: taraflar, konu, ödeme, ifa, cayma hakkı ve uyuşmazlıkların çözümü.",
            updated: "Son güncelleme",
            sections: [
                { heading: "1. Taraflar", paragraphs: ["**SATICI:** Clinova; bilgileri bu sayfanın altında yer almaktadır. **ALICI:** siparişi tamamlayan ve ödeme sırasında bilgilerini giren kişi veya klinik. Alıcı, siparişi tamamlayarak bu sözleşmeyi okuduğunu ve kabul ettiğini beyan eder."] },
                { heading: "2. Sözleşmenin konusu", paragraphs: ["Bu sözleşme, alıcının Clinova web sitesinden mesafeli olarak sipariş ettiği dijital hizmetlerin satışına ilişkin tarafların hak ve yükümlülüklerini, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca belirler."] },
                { heading: "3. Hizmet ve bedel", paragraphs: ["Hizmetin tanımı, süresi, bedeli ve para birimi ödemeden önce teklifte veya sipariş sayfasında belirtilir ve bu sözleşmenin parçasıdır. Aksi belirtilmedikçe fiyatlara vergiler dahildir. Hizmet dijital olduğundan kargo ücreti yoktur."] },
                { heading: "4. Ödeme", paragraphs: ["Ödeme, lisanslı ödeme kuruluşu iyzico üzerinden banka veya kredi kartıyla (Visa, Mastercard vb.) yapılır. Satıcı kart numaranızı görmez ve saklamaz."] },
                { heading: "5. İfa ve teslimat", paragraphs: ["Hizmet, ödemenin onaylanmasından sonra \"Teslimat ve İade Şartları\" sayfasında belirtilen süre içinde elektronik ortamda sunulur. Alıcı, ifa için gereken bilgi ve erişimi satıcıya sağlar."] },
                { heading: "6. Cayma hakkı ve iade", paragraphs: ["Alıcı, hizmetin ifasına başlanmamış olması şartıyla, ödemeden itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin siparişten cayabilir. Dijital hizmetin ifasına bu süre dolmadan alıcının onayıyla başlanmışsa, Mesafeli Sözleşmeler Yönetmeliği uyarınca cayma hakkı sona erer. İptal ve iade ayrıntıları \"Teslimat ve İade Şartları\" sayfasındadır; iade ödemede kullanılan karta yapılır."] },
                { heading: "7. Sorumluluk", paragraphs: ["Satıcı hizmeti tarif edildiği gibi sunar. Mücbir sebepten veya internet, ödeme ya da WhatsApp sağlayıcılarındaki kendi kontrolü dışındaki arızalardan kaynaklanan gecikme ya da kesintilerden sorumlu değildir."] },
                { heading: "8. Kişisel verilerin korunması", paragraphs: ["Alıcının verileri, sitede yayımlanan gizlilik politikası ve 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) çerçevesinde işlenir."] },
                { heading: "9. Uyuşmazlıkların çözümü", paragraphs: ["Türkiye Cumhuriyeti kanunları uygulanır. Alıcı, kanunda belirlenen parasal sınırlar dahilinde, ikamet ettiği yerdeki Tüketici Hakem Heyetlerine veya Tüketici Mahkemelerine başvurabilir."] },
                { heading: "10. Yürürlük", paragraphs: ["Sözleşme, alıcının siparişi ve ödemeyi tamamlamasıyla kurulur; talep halinde bir nüshası e-postasına veya telefonuna gönderilir."] },
            ],
        },
        fr: {
            title: "Contrat de vente à distance",
            description: "Le contrat de vente à distance des services numériques de Clinova : parties, objet, paiement, exécution, droit de rétractation et litiges.",
            updated: "Dernière mise à jour",
            sections: [
                { heading: "1. Parties", paragraphs: ["**Vendeur :** Clinova, dont les informations figurent en bas de cette page. **Acheteur :** la personne ou la clinique qui valide la commande et saisit ses informations. En validant la commande, l'acheteur confirme avoir lu et accepté ce contrat."] },
                { heading: "2. Objet", paragraphs: ["Ce contrat fixe les droits et obligations des parties pour la vente à distance des services numériques commandés par l'acheteur sur le site Clinova, conformément à la loi turque n° 6502 sur la protection du consommateur et au règlement sur les contrats à distance."] },
                { heading: "3. Service et prix", paragraphs: ["Le service, sa description, sa durée, son prix et sa devise sont indiqués dans l'offre ou sur la page de commande avant le paiement et font partie du contrat. Les prix incluent les taxes sauf mention contraire. Il n'y a pas de frais d'expédition, le service étant numérique."] },
                { heading: "4. Paiement", paragraphs: ["Le paiement s'effectue par carte bancaire (Visa, Mastercard, etc.) via l'établissement de paiement agréé iyzico. Le vendeur ne voit ni ne conserve votre numéro de carte."] },
                { heading: "5. Exécution et livraison", paragraphs: ["Le service est fourni par voie électronique après confirmation du paiement, dans le délai indiqué sur la page « Conditions de livraison et de retour ». L'acheteur fournit les informations et accès nécessaires à l'exécution."] },
                { heading: "6. Droit de rétractation et remboursement", paragraphs: ["L'acheteur peut se rétracter dans les 14 jours suivant le paiement, sans motif, tant que l'exécution du service n'a pas commencé. Si l'exécution du service numérique commence avec son accord avant la fin de ce délai, le droit de rétractation prend fin selon le règlement sur les contrats à distance. Le détail de l'annulation et du remboursement figure sur la page « Conditions de livraison et de retour » ; le remboursement est effectué sur la même carte."] },
                { heading: "7. Responsabilité", paragraphs: ["Le vendeur fournit le service tel que décrit. Il n'est pas responsable des retards ou interruptions dus à la force majeure ou à des pannes indépendantes de sa volonté chez les fournisseurs d'accès, de paiement ou WhatsApp."] },
                { heading: "8. Protection des données", paragraphs: ["Les données de l'acheteur sont traitées selon la politique de confidentialité publiée sur le site et la loi turque n° 6698 sur la protection des données personnelles (KVKK)."] },
                { heading: "9. Litiges", paragraphs: ["Le droit de la République de Turquie s'applique. L'acheteur peut saisir les commissions d'arbitrage des consommateurs ou les tribunaux de la consommation de son lieu de résidence, dans les limites monétaires fixées par la loi."] },
                { heading: "10. Entrée en vigueur", paragraphs: ["Le contrat est conclu lorsque l'acheteur valide la commande et le paiement ; une copie est envoyée par e-mail ou téléphone sur demande."] },
            ],
        },
    },
};
