import type { SiteLanguage } from "../i18n";

// Clinova's six services: three core (marketing, sales and call center, CRM) and three supporting (website and search, reputation, social media and branding), used in structured data and llms.txt.
export const services: Record<SiteLanguage, { name: string; description: string }[]> = {
    ar: [
        { name: "التسويق وجذب المرضى", description: "إدارة الحملات الإعلانية على منصات مثل Meta وGoogle وSnapchat وTikTok، واستهداف المرضى المحتملين المهتمين بالخدمات الطبية التي تقدمها العيادة، بهدف توليد استفسارات وفرص حجز جديدة بشكل مستمر." },
        { name: "المبيعات والكول سنتر الطبي", description: "فريق متخصص في التواصل مع المرضى المحتملين، والرد على استفساراتهم، ومتابعتهم، والتعامل مع اعتراضاتهم، وتحويل اهتمامهم إلى مواعيد وحجوزات فعلية مع العيادة." },
        { name: "أنظمة إدارة المرضى CRM", description: "نظام رقمي متكامل لإدارة رحلة المريض داخل العيادة، من أول استفسار وحتى إتمام العلاج، مع أتمتة المتابعة والتذكير بالمواعيد، وإعادة التواصل مع المرضى، بهدف زيادة التحويلات وتقليل حالات عدم الحضور (No-Show)." },
        { name: "الحضور الرقمي ومحركات البحث", description: "تصميم وتطوير مواقع إلكترونية احترافية للعيادات، وتحسين ظهورها في نتائج بحث Google، والعمل على تحسين فرص ظهور محتواها في إجابات محركات الذكاء الاصطناعي مثل ChatGPT." },
        { name: "إدارة السمعة والتقييمات", description: "إدارة وتحسين السمعة الرقمية للعيادة من خلال متابعة تقييمات Google Maps، والرد على مراجعات المرضى، وإدارة الانطباع الرقمي، وتعزيز ثقة المريض المحتمل بالعيادة." },
        { name: "إدارة السوشيال ميديا والهوية", description: "إدارة حسابات التواصل الاجتماعي، وإعداد المحتوى الطبي والتصاميم والمنشورات، وتطوير الهوية البصرية للعيادة، لبناء حضور احترافي وتعزيز الثقة والوعي بالعلامة التجارية." },
    ],
    en: [
        { name: "Medical marketing and patient acquisition", description: "Managing ad campaigns on platforms such as Meta, Google, Snapchat and TikTok, and targeting potential patients interested in the medical services your clinic offers, with the goal of continuously generating new inquiries and booking opportunities." },
        { name: "Medical sales and call center", description: "A specialised team that contacts potential patients, answers their questions, follows up with them, handles their objections, and turns their interest into real appointments and bookings at the clinic." },
        { name: "Patient management systems (CRM)", description: "A complete digital system to manage the patient journey inside the clinic, from the first inquiry to the end of treatment, with automated follow-up and appointment reminders and re-engagement of patients, to increase conversions and reduce no-shows." },
        { name: "Digital presence and search engines", description: "Designing and developing professional websites for clinics, improving their visibility in Google search results, and working to improve the chances of their content appearing in the answers of AI engines such as ChatGPT." },
        { name: "Reputation and reviews management", description: "Managing and improving the clinic's online reputation by monitoring Google Maps reviews, replying to patient reviews, managing the digital impression, and strengthening potential patients' trust in the clinic." },
        { name: "Social media and branding", description: "Managing social media accounts, preparing medical content, designs and posts, and developing the clinic's visual identity, to build a professional presence and strengthen trust and brand awareness." },
    ],
    tr: [
        { name: "Tıbbi pazarlama ve hasta kazanımı", description: "Meta, Google, Snapchat ve TikTok gibi platformlarda reklam kampanyalarının yönetimi ve kliniğinizin sunduğu tıbbi hizmetlerle ilgilenen potansiyel hastaların hedeflenmesi; amaç sürekli olarak yeni talepler ve randevu fırsatları oluşturmaktır." },
        { name: "Tıbbi satış ve çağrı merkezi", description: "Potansiyel hastalarla iletişim kuran, sorularını yanıtlayan, takip eden, itirazlarını ele alan ve ilgilerini klinikte gerçek randevulara ve rezervasyonlara dönüştüren uzman bir ekip." },
        { name: "Hasta yönetim sistemleri (CRM)", description: "Kliniğin içinde hasta yolculuğunu ilk talepten tedavinin tamamlanmasına kadar yöneten bütünleşik bir dijital sistem; takip ve randevu hatırlatmalarının otomasyonu ve hastalarla yeniden iletişim ile dönüşümleri artırmayı ve randevuya gelmeme (No-Show) durumlarını azaltmayı hedefler." },
        { name: "Dijital varlık ve arama motorları", description: "Klinikler için profesyonel web siteleri tasarlamak ve geliştirmek, Google arama sonuçlarındaki görünürlüklerini artırmak ve içeriklerinin ChatGPT gibi yapay zekâ motorlarının yanıtlarında yer alma şansını geliştirmek için çalışmak." },
        { name: "İtibar ve değerlendirme yönetimi", description: "Google Maps değerlendirmelerini takip ederek, hasta yorumlarını yanıtlayarak, dijital izlenimi yöneterek ve potansiyel hastaların kliniğe güvenini güçlendirerek kliniğin çevrimiçi itibarını yönetmek ve geliştirmek." },
        { name: "Sosyal medya ve marka kimliği", description: "Sosyal medya hesaplarını yönetmek, tıbbi içerik, tasarım ve gönderiler hazırlamak ve kliniğin görsel kimliğini geliştirmek; profesyonel bir varlık oluşturmak, güveni ve marka bilinirliğini güçlendirmek." },
    ],
    fr: [
        { name: "Marketing médical et acquisition de patients", description: "Gestion des campagnes publicitaires sur des plateformes comme Meta, Google, Snapchat et TikTok, et ciblage des patients potentiels intéressés par les services médicaux de votre clinique, afin de générer en continu de nouvelles demandes et des opportunités de réservation." },
        { name: "Ventes médicales et centre d'appels", description: "Une équipe spécialisée qui contacte les patients potentiels, répond à leurs questions, assure leur suivi, traite leurs objections et transforme leur intérêt en rendez-vous et réservations réels à la clinique." },
        { name: "Systèmes de gestion des patients (CRM)", description: "Un système numérique complet pour gérer le parcours du patient au sein de la clinique, de la première demande à la fin du traitement, avec l'automatisation du suivi et des rappels de rendez-vous et la reprise de contact avec les patients, afin d'augmenter les conversions et de réduire les absences (No-Show)." },
        { name: "Présence numérique et moteurs de recherche", description: "Conception et développement de sites web professionnels pour les cliniques, amélioration de leur visibilité dans les résultats de recherche Google, et travail pour améliorer les chances que leur contenu apparaisse dans les réponses des moteurs d'IA comme ChatGPT." },
        { name: "Gestion de la réputation et des avis", description: "Gestion et amélioration de la réputation en ligne de la clinique en suivant les avis Google Maps, en répondant aux avis des patients, en gérant l'impression numérique et en renforçant la confiance des patients potentiels envers la clinique." },
        { name: "Réseaux sociaux et identité de marque", description: "Gestion des comptes de réseaux sociaux, préparation de contenus médicaux, de visuels et de publications, et développement de l'identité visuelle de la clinique, pour construire une présence professionnelle et renforcer la confiance et la notoriété de la marque." },
    ],
};
