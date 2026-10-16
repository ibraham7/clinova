import type { SiteLanguage } from "../i18n";

// Clinova's seven services, used in structured data and llms.txt.
export const services: Record<SiteLanguage, { name: string; description: string }[]> = {
    ar: [
        { name: "جذب المرضى الجدد", description: "نستخدم Google وMeta وSEO للوصول إلى الأشخاص الذين يبحثون فعليًا عن خدمات العيادة، ونحوّل هذا الاهتمام إلى استفسارات وفرص حقيقية للحجز." },
        { name: "نظام إدارة ونمو العيادة (CRM)", description: "نظام CRM متكامل يجمع المرضى والاستفسارات والمواعيد والمتابعات، ويمنح رؤية واضحة لمسار كل مريض من أول تواصل وحتى ما بعد العلاج." },
        { name: "تواصل ذكي يجمع بين AI والفريق البشري", description: "يستجيب الذكاء الاصطناعي لاستفسارات المرضى على مدار الساعة عبر WhatsApp، بينما يتولى فريقنا المتابعة والتواصل الإنساني خلال أوقات العمل." },
        { name: "تأهيل المرضى وحجز المواعيد", description: "نتولى تأهيل المرضى وفهم احتياجاتهم والإجابة عن استفساراتهم ومتابعتهم حتى حجز الموعد المناسب." },
        { name: "فريق مبيعات وتنسيق علاجي", description: "فريق متخصص ومدرّب على التواصل مع المرضى وشرح الخيارات العلاجية المناسبة باحترافية وإنسانية، مع متابعة مستمرة حتى اتخاذ القرار." },
        { name: "إعادة تنشيط المرضى والبيانات القديمة", description: "حملات إعادة تنشيط ومتابعة وعروض مخصصة للوصول إلى المرضى الذين لم يحجزوا أو انقطعوا عن العلاج وتحويلهم إلى فرص جديدة." },
        { name: "بناء السمعة والتقييمات", description: "تعزيز الحضور الرقمي للعيادة وتشجيع المرضى على مشاركة تجاربهم الحقيقية للحصول على المزيد من التقييمات وبناء الثقة." },
    ],
    en: [
        { name: "New patient acquisition", description: "We use Google, Meta and SEO to reach people who are actively searching for the clinic's services, and turn that interest into real inquiries and booking opportunities." },
        { name: "Clinic management and growth system (CRM)", description: "An integrated CRM that brings patients, inquiries, appointments and follow-ups together, with a clear view of every patient's journey from first contact to after treatment." },
        { name: "Smart communication: AI plus a human team", description: "AI answers patient inquiries on WhatsApp around the clock, while our team handles follow-up and human conversations during working hours." },
        { name: "Patient qualification and appointment booking", description: "We qualify patients, understand their needs, answer their questions and follow up until the right appointment is booked." },
        { name: "Sales and treatment coordination team", description: "A trained team that talks with patients, explains suitable treatment options professionally and humanely, and follows up until they decide." },
        { name: "Reactivating past patients and old leads", description: "Reactivation campaigns, follow-ups and tailored offers that reach patients who never booked or stopped treatment, and turn them into new opportunities." },
        { name: "Reputation and reviews", description: "Strengthening the clinic's online presence and encouraging patients to share their real experiences, to earn more reviews and build trust." },
    ],
    tr: [
        { name: "Yeni hasta kazanımı", description: "Kliniğin hizmetlerini gerçekten arayan kişilere Google, Meta ve SEO ile ulaşıyor, bu ilgiyi gerçek taleplere ve randevu fırsatlarına dönüştürüyoruz." },
        { name: "Klinik yönetim ve büyüme sistemi (CRM)", description: "Hastaları, talepleri, randevuları ve takipleri bir araya getiren, her hastanın ilk temastan tedavi sonrasına kadar yolculuğunu net gösteren entegre bir CRM." },
        { name: "Akıllı iletişim: yapay zekâ ve insan ekibi", description: "Yapay zekâ WhatsApp'ta hasta sorularını 7/24 yanıtlar; ekibimiz çalışma saatlerinde takip ve birebir iletişimi üstlenir." },
        { name: "Hasta ön değerlendirme ve randevu", description: "Hastaları değerlendirir, ihtiyaçlarını anlar, sorularını yanıtlar ve doğru randevu alınana kadar takip ederiz." },
        { name: "Satış ve tedavi koordinasyon ekibi", description: "Hastalarla iletişim kuran, uygun tedavi seçeneklerini profesyonel ve insani biçimde anlatan ve karar verilene kadar takip eden eğitimli bir ekip." },
        { name: "Eski hastaları ve verileri yeniden kazanma", description: "Randevu almamış ya da tedaviyi bırakmış hastalara ulaşan yeniden aktivasyon kampanyaları, takipler ve kişiye özel teklifler." },
        { name: "İtibar ve değerlendirmeler", description: "Kliniğin dijital varlığını güçlendirir, hastaları gerçek deneyimlerini paylaşmaya teşvik ederek daha fazla değerlendirme ve güven kazandırırız." },
    ],
    fr: [
        { name: "Acquisition de nouveaux patients", description: "Nous utilisons Google, Meta et le SEO pour toucher les personnes qui recherchent réellement les services de la clinique, et transformons cet intérêt en demandes et en rendez-vous." },
        { name: "Système de gestion et de croissance (CRM)", description: "Un CRM intégré qui réunit patients, demandes, rendez-vous et suivis, avec une vision claire du parcours de chaque patient, du premier contact à l'après-traitement." },
        { name: "Communication intelligente : IA et équipe humaine", description: "L'IA répond aux demandes des patients sur WhatsApp 24h/24, tandis que notre équipe assure le suivi et le contact humain pendant les heures d'ouverture." },
        { name: "Qualification des patients et prise de rendez-vous", description: "Nous qualifions les patients, comprenons leurs besoins, répondons à leurs questions et assurons le suivi jusqu'à la prise du bon rendez-vous." },
        { name: "Équipe commerciale et coordination des soins", description: "Une équipe formée qui échange avec les patients, explique les options de traitement avec professionnalisme et humanité, et assure le suivi jusqu'à la décision." },
        { name: "Réactivation des anciens patients et des données", description: "Des campagnes de réactivation, des relances et des offres personnalisées pour les patients qui n'ont pas pris rendez-vous ou ont interrompu leur traitement." },
        { name: "Réputation et avis", description: "Renforcer la présence en ligne de la clinique et encourager les patients à partager leurs vraies expériences, pour obtenir plus d'avis et inspirer confiance." },
    ],
};
