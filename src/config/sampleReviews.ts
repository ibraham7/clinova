
import type { ClientReview } from "./clientReviews";

// Fictional sample reviews for preview/demo use only.
// Not verified client testimonials. Do not publish as real reviews.
export const sampleReviews: ClientReview[] = [
  // ==================== Arabic ====================
  {
    language: "ar",
    name: "د. أحمد الخطيب",
    detail: "طب الأسنان · إسطنبول",
    rating: 5,
    text: "أكثر شيء أعجبني هو تنظيم التواصل مع المرضى. بدل ما تضيع الاستفسارات بين الرسائل والمكالمات، صار في طريقة واضحة لمتابعة كل حالة من أول تواصل حتى موعد الزيارة. تجربة مريحة جدًا لفريق العيادة."
  },
  {
    language: "ar",
    name: "د. سارة محمود",
    detail: "طب الجلدية · دبي",
    rating: 4.5,
    text: "كنا نعاني من كثرة الاستفسارات التي لا تتحول إلى مواعيد فعلية. آلية متابعة المرضى ساعدتنا على ترتيب الأولويات والرد بشكل أسرع. أكثر ما أقدّره هو اهتمام الفريق بالتفاصيل واستجابته للملاحظات."
  },
  {
    language: "ar",
    name: "د. محمد الحسن",
    detail: "جراحة التجميل · الرياض",
    rating: 4,
    text: "التجربة جيدة بشكل عام، خصوصًا في تنظيم طلبات الاستشارة ومتابعة المرضى المهتمين بالإجراءات التجميلية. احتجنا بعض الوقت في البداية لضبط طريقة العمل بما يناسب العيادة، لكن التواصل مع الفريق كان ممتازًا."
  },
  {
    language: "ar",
    name: "د. ليلى منصور",
    detail: "الأمراض الجلدية · جدة",
    rating: 3.5,
    text: "أعجبني أسلوب العمل والمتابعة، لكن كنت أتمنى أن تكون مرحلة الإعداد الأولى أسرع قليلًا. لاحظنا تحسنًا في تنظيم الرسائل والردود، وما زالت هناك بعض التفاصيل التي تحتاج إلى تطوير."
  },
  {
    language: "ar",
    name: "د. خالد العبدالله",
    detail: "زراعة الأسنان · الدوحة",
    rating: 5,
    text: "الفرق الحقيقي بالنسبة لي لم يكن في عدد الاستفسارات فقط، بل في جودتها. أصبح فريق الاستقبال يتعامل مع مرضى لديهم اهتمام واضح بالعلاج، مع معلومات أولية تساعدنا على تجهيز الاستشارة بشكل أفضل."
  },
  {
    language: "ar",
    name: "د. ريم إبراهيم",
    detail: "طب التجميل · أبوظبي",
    rating: 4.5,
    text: "أكثر ما يميز التجربة هو الجمع بين التسويق والمتابعة. لم يعد الأمر مجرد إعلان يجلب رسائل، بل أصبح هناك اهتمام بما يحدث بعد تواصل المريض. أعجبني أيضًا وضوح التقارير وسهولة مناقشة النتائج."
  },
  {
    language: "ar",
    name: "د. يوسف النجار",
    detail: "تقويم الأسنان · عمّان",
    rating: 3,
    text: "الفكرة ممتازة والخدمة مفيدة، لكن النتائج في البداية لم تكن بالمستوى الذي توقعناه. بعد تعديل طريقة التواصل وتنظيم المواعيد بدأنا نلاحظ تحسنًا. أعتقد أن التجربة تحتاج وقتًا وتعاونًا من فريق العيادة."
  },
  {
    language: "ar",
    name: "د. نور الهاشمي",
    detail: "طب الأسنان · الكويت",
    rating: 5,
    text: "كنت أبحث عن جهة تفهم طبيعة العمل داخل العيادات، وليس فقط التسويق الرقمي. أعجبني اهتمام الفريق برحلة المريض كاملة، من أول استفسار إلى الحجز والمتابعة. التواصل واضح والتعامل احترافي."
  },

  // ==================== English ====================
  {
    language: "en",
    name: "Dr. James Wilson",
    detail: "Dentistry · London",
    rating: 5,
    text: "What impressed me most was the attention to patient communication. Having a structured follow-up process makes it much easier for our reception team to manage enquiries and appointment requests. The overall experience has been excellent."
  },
  {
    language: "en",
    name: "Dr. Emily Carter",
    detail: "Dermatology · Manchester",
    rating: 4.5,
    text: "We used to spend a lot of time answering enquiries without knowing which patients were genuinely interested in booking. The new workflow has made things more organised, and the team has been very responsive whenever we needed adjustments."
  },
  {
    language: "en",
    name: "Dr. Michael Anderson",
    detail: "Plastic Surgery · New York",
    rating: 4,
    text: "A well-structured approach to patient acquisition and follow-up. It took some time to fine-tune the process for our clinic, but communication was consistent throughout. I particularly appreciate the focus on qualified consultations rather than just generating more leads."
  },
  {
    language: "en",
    name: "Dr. Olivia Bennett",
    detail: "Aesthetic Medicine · Toronto",
    rating: 3.5,
    text: "The team is professional and easy to work with. There were a few delays during the initial setup, but once everything was running, managing patient enquiries became noticeably simpler. I'd love to see more flexibility in the reporting options."
  },
  {
    language: "en",
    name: "Dr. Daniel Roberts",
    detail: "Dental Implants · Chicago",
    rating: 5,
    text: "One of the biggest improvements has been the quality of our initial patient conversations. Our staff now receives more organised information before consultations, which helps us prepare better and spend more time addressing patients' actual concerns."
  },
  {
    language: "en",
    name: "Dr. Sophia Mitchell",
    detail: "Dermatology · Sydney",
    rating: 4.5,
    text: "I appreciate that the service goes beyond advertising. The team looks at what happens after a patient sends an enquiry, including response times, follow-ups and bookings. That broader perspective has made a real difference to how we manage our workflow."
  },
  {
    language: "en",
    name: "Dr. Alexander Reed",
    detail: "Orthodontics · Birmingham",
    rating: 3,
    text: "The concept is promising, although it took longer than expected to see improvements in our appointment process. Some parts of the workflow needed adjustments for our practice. The support team listened to our feedback and helped address the issues."
  },
  {
    language: "en",
    name: "Dr. Charlotte Evans",
    detail: "Cosmetic Dentistry · Dublin",
    rating: 5,
    text: "A refreshingly practical approach to clinic growth. Everything feels connected, from the first patient enquiry to appointment coordination. What I value most is knowing that no conversation is simply forgotten after the initial contact."
  },

  // ==================== French ====================
  {
    language: "fr",
    name: "Dr. Thomas Dubois",
    detail: "Dentisterie · Paris",
    rating: 5,
    text: "Ce que j'ai particulièrement apprécié, c'est l'organisation du suivi des patients. Les demandes sont mieux structurées et notre équipe peut consacrer davantage de temps aux consultations. Une collaboration sérieuse et très professionnelle."
  },
  {
    language: "fr",
    name: "Dr. Camille Laurent",
    detail: "Dermatologie · Lyon",
    rating: 4.5,
    text: "Avant, nous recevions beaucoup de messages sans toujours savoir lesquels nécessitaient une réponse prioritaire. Le nouveau système nous aide à mieux organiser les demandes et à assurer un suivi plus régulier. L'équipe reste très disponible."
  },
  {
    language: "fr",
    name: "Dr. Nicolas Moreau",
    detail: "Chirurgie esthétique · Marseille",
    rating: 4,
    text: "Une approche intéressante qui ne se limite pas à la publicité. Le suivi des demandes et la préparation des consultations sont bien pensés. La mise en place a demandé quelques ajustements, mais le résultat correspond globalement à nos attentes."
  },
  {
    language: "fr",
    name: "Dr. Sophie Bernard",
    detail: "Médecine esthétique · Bordeaux",
    rating: 3.5,
    text: "L'accompagnement est sérieux et les échanges sont agréables. J'aurais toutefois souhaité une mise en place un peu plus rapide. Une fois le processus stabilisé, la gestion des demandes est devenue plus simple pour notre secrétariat."
  },
  {
    language: "fr",
    name: "Dr. Julien Lefebvre",
    detail: "Implantologie dentaire · Lille",
    rating: 5,
    text: "Nous cherchions surtout à améliorer la qualité des demandes de consultation. J'ai apprécié la manière dont chaque étape du parcours patient a été étudiée. Notre équipe dispose désormais d'informations plus claires avant les premiers rendez-vous."
  },
  {
    language: "fr",
    name: "Dr. Emma Martin",
    detail: "Dermatologie · Nice",
    rating: 4.5,
    text: "Le principal avantage, selon moi, est la continuité entre la communication digitale et le travail quotidien de la clinique. Les patients reçoivent un meilleur accompagnement et nous avons une vision plus claire des demandes en cours."
  },
  {
    language: "fr",
    name: "Dr. Antoine Girard",
    detail: "Orthodontie · Toulouse",
    rating: 3,
    text: "Le service présente de vrais avantages, notamment pour centraliser les demandes. Les premières semaines ont nécessité plusieurs modifications afin de mieux s'adapter à notre organisation. Le support est réactif, mais certains outils pourraient être simplifiés."
  },
  {
    language: "fr",
    name: "Dr. Claire Rousseau",
    detail: "Dentisterie esthétique · Nantes",
    rating: 5,
    text: "Une expérience très positive. J'apprécie particulièrement l'attention portée aux détails et à la relation avec les patients. Le processus est clair, les échanges sont fluides et l'équipe comprend les besoins spécifiques d'un cabinet dentaire."
  },

  // ==================== Turkish ====================
  {
    language: "tr",
    name: "Dr. Ahmet Yılmaz",
    detail: "Diş Hekimliği · İstanbul",
    rating: 5,
    text: "Hasta iletişiminin daha düzenli ilerlemesi bizim için önemliydi. Özellikle ilk başvurudan randevu aşamasına kadar olan sürecin tek bir sistem üzerinden takip edilebilmesi oldukça faydalı. Ekip gerçekten işini özenle yapıyor."
  },
  {
    language: "tr",
    name: "Dr. Elif Demir",
    detail: "Dermatoloji · Ankara",
    rating: 4.5,
    text: "Önceden gelen mesajları takip etmek ve hastalara zamanında dönüş yapmak oldukça yorucuydu. Süreçlerin düzenlenmesiyle birlikte ekibimizin işi kolaylaştı. Özellikle geri bildirimlerimize hızlı dönüş yapılmasından memnun kaldım."
  },
  {
    language: "tr",
    name: "Dr. Mehmet Kaya",
    detail: "Plastik Cerrahi · İzmir",
    rating: 4,
    text: "Sadece reklam odaklı değil, hasta başvurusundan görüşme aşamasına kadar tüm süreci ele alan bir çalışma. Başlangıçta kliniğimizin işleyişine uygun bazı düzenlemeler yapılması gerekti ama genel olarak verimli bir deneyim oldu."
  },
  {
    language: "tr",
    name: "Dr. Zeynep Çelik",
    detail: "Estetik Tıp · Antalya",
    rating: 3.5,
    text: "İletişim konusunda ilgili ve çözüm odaklı bir ekiple çalıştık. İlk kurulum süreci beklediğimizden biraz uzun sürdü. Buna rağmen hasta taleplerinin takibi konusunda olumlu gelişmeler gördük. Raporlama seçenekleri biraz daha geliştirilebilir."
  },
  {
    language: "tr",
    name: "Dr. Emre Şahin",
    detail: "Dental İmplantoloji · Bursa",
    rating: 5,
    text: "Bizim için önemli olan yalnızca daha fazla başvuru almak değil, doğru hastalarla iletişim kurabilmekti. Ön görüşmelerin daha düzenli yürütülmesi sayesinde ekibimiz randevulara çok daha hazırlıklı hale geldi. Hizmetten oldukça memnunuz."
  },
  {
    language: "tr",
    name: "Dr. Ayşe Arslan",
    detail: "Dermatoloji · Gaziantep",
    rating: 4.5,
    text: "Kliniğimizde dijital iletişim ve hasta takibi konusunda daha düzenli bir yapıya ihtiyaç duyuyorduk. Özellikle başvuruların sınıflandırılması ve geri dönüşlerin takip edilmesi işimizi kolaylaştırdı. Ekibin yaklaşımı da oldukça profesyonel."
  },
  {
    language: "tr",
    name: "Dr. Burak Özdemir",
    detail: "Ortodonti · Konya",
    rating: 3,
    text: "Genel olarak faydalı bir hizmet, ancak başlangıçta beklentilerimizle sonuçlar arasında bazı farklılıklar vardı. Hasta takibi süreçlerinde birkaç değişiklik yapılması gerekti. Destek ekibi yardımcı oldu fakat sistemin bazı bölümleri daha pratik olabilir."
  },
  {
    language: "tr",
    name: "Dr. Selin Aydın",
    detail: "Estetik Diş Hekimliği · İstanbul",
    rating: 5,
    text: "Kliniğimizin ihtiyaçlarını anlayan bir ekiple çalışmak gerçekten fark yaratıyor. Hasta başvurularının düzenlenmesi, randevu takibi ve iletişim süreçlerinin birlikte ele alınması günlük iş akışımızı çok daha rahat hale getirdi. Kesinlikle başarılı bir çalışma."
  }
];
