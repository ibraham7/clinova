import type { SiteLanguage } from "../i18n";

// Search titles stay under ~60 characters and descriptions under ~160 where the language allows.
export const homeMeta: Record<SiteLanguage, { title: string; description: string }> = {
    ar: {
        title: "Clinova | تسويق العيادات ونظام CRM ومتابعة المرضى",
        description: "Clinova تساعد العيادات على جذب مرضى جدد عبر Google وMeta وSEO، وإدارة الاستفسارات والمواعيد بنظام CRM، والرد على المرضى 24/7 عبر WhatsApp بالذكاء الاصطناعي وفريق بشري.",
    },
    en: {
        title: "Clinova | Clinic Marketing, CRM & Patient Follow-Up",
        description: "Clinova helps medical clinics attract new patients with Google, Meta and SEO, manage inquiries and appointments in one CRM, and answer patients 24/7 on WhatsApp with AI and a human team.",
    },
    tr: {
        title: "Clinova | Klinik Pazarlama, CRM ve Hasta Takibi",
        description: "Clinova, kliniklerin Google, Meta ve SEO ile yeni hastalara ulaşmasını, talepleri ve randevuları tek bir CRM'de yönetmesini ve WhatsApp'ta yapay zekâ ile ekip desteğiyle 7/24 yanıt vermesini sağlar.",
    },
    fr: {
        title: "Clinova | Marketing médical, CRM et suivi des patients",
        description: "Clinova aide les cliniques à attirer de nouveaux patients avec Google, Meta et le SEO, à gérer demandes et rendez-vous dans un CRM et à répondre 24h/24 sur WhatsApp grâce à l'IA et à une équipe humaine.",
    },
};

export const blogMeta: Record<SiteLanguage, { title: string; description: string; heading: string; intro: string }> = {
    ar: {
        title: "مدونة Clinova | أدلة عملية لنمو العيادات",
        description: "مقالات عملية لأصحاب العيادات عن جذب المرضى، وأنظمة CRM، والرد عبر WhatsApp، وتحويل الاستفسارات إلى حجوزات، وبناء السمعة والتقييمات.",
        heading: "أدلة عملية لنمو عيادتك",
        intro: "خلاصة ما نطبقه يوميًا مع العيادات: من أول إعلان حتى عودة المريض لزيارته الثانية.",
    },
    en: {
        title: "Clinova Blog | Practical Guides to Grow Your Clinic",
        description: "Practical articles for clinic owners on patient acquisition, CRM systems, WhatsApp response, turning inquiries into bookings, and building reviews and reputation.",
        heading: "Practical guides to grow your clinic",
        intro: "What we apply with clinics every day, from the first ad to the patient's second visit.",
    },
    tr: {
        title: "Clinova Blog | Kliniğinizi Büyütmek İçin Pratik Rehberler",
        description: "Klinik sahipleri için hasta kazanımı, CRM sistemleri, WhatsApp yanıtı, talepleri randevuya dönüştürme ve itibar yönetimi üzerine pratik yazılar.",
        heading: "Kliniğinizi büyütmek için pratik rehberler",
        intro: "İlk reklamdan hastanın ikinci ziyaretine kadar kliniklerle her gün uyguladıklarımız.",
    },
    fr: {
        title: "Blog Clinova | Guides pratiques pour développer votre clinique",
        description: "Des articles pratiques pour les cliniques : acquisition de patients, CRM, réponse WhatsApp, conversion des demandes en rendez-vous, avis et réputation.",
        heading: "Guides pratiques pour développer votre clinique",
        intro: "Ce que nous appliquons chaque jour avec les cliniques, de la première annonce à la deuxième visite du patient.",
    },
};
