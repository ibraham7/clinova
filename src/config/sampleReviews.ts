
import type { ClientReview } from "./clientReviews";

// Preview-only placeholders that show the layout; never shown on the production site.
export const sampleReviews: ClientReview[] = [
  // Arabic
  { language: "ar", name: "د. أحمد الخطيب", detail: "طب الأسنان · إسطنبول", rating: 5, text: "نص توضيحي قصير لتقييم عميل." },
  { language: "ar", name: "د. سارة محمود", detail: "طب الجلدية · دبي", rating: 4.5, text: "هنا يظهر رأي العميل الحقيقي بكلماته كما أرسله لكم، بعد موافقته على النشر." },
  { language: "ar", name: "د. محمد الحسن", detail: "جراحة التجميل · الرياض", rating: 4, text: "نموذج لتعليق أطول: يمكن أن يذكر العميل ما الذي تغيّر في عيادته، وما الذي أعجبه في الخدمة، وما الذي يتمنى تطويره لاحقًا." },
  { language: "ar", name: "د. ليلى منصور", detail: "الأمراض الجلدية · جدة", rating: 3.5, text: "نص توضيحي قصير لتقييم عميل." },
  { language: "ar", name: "د. خالد العبدالله", detail: "زراعة الأسنان · الدوحة", rating: 5, text: "هنا يظهر رأي العميل الحقيقي بكلماته كما أرسله لكم، بعد موافقته على النشر." },
  { language: "ar", name: "د. ريم إبراهيم", detail: "طب التجميل · أبوظبي", rating: 4.5, text: "نموذج لتعليق أطول: يمكن أن يذكر العميل ما الذي تغيّر في عيادته، وما الذي أعجبه في الخدمة، وما الذي يتمنى تطويره لاحقًا." },
  { language: "ar", name: "د. يوسف النجار", detail: "تقويم الأسنان · عمّان", rating: 3, text: "نص توضيحي قصير لتقييم عميل." },
  { language: "ar", name: "د. نور الهاشمي", detail: "طب الأسنان · الكويت", rating: 5, text: "هنا يظهر رأي العميل الحقيقي بكلماته كما أرسله لكم، بعد موافقته على النشر." },

  // English
  { language: "en", name: "Dr. James Wilson", detail: "Dentistry · London", rating: 5, text: "A short placeholder review." },
  { language: "en", name: "Dr. Emily Carter", detail: "Dermatology · Manchester", rating: 4.5, text: "The client's real review appears here, in their own words, once they agree to publish it." },
  { language: "en", name: "Dr. Michael Anderson", detail: "Plastic Surgery · New York", rating: 4, text: "A longer placeholder: a client might describe what changed at their clinic, what they liked about the service and what they'd like improved next." },
  { language: "en", name: "Dr. Olivia Bennett", detail: "Aesthetic Medicine · Toronto", rating: 3.5, text: "A short placeholder review." },
  { language: "en", name: "Dr. Daniel Roberts", detail: "Dental Implants · Chicago", rating: 5, text: "The client's real review appears here, in their own words, once they agree to publish it." },
  { language: "en", name: "Dr. Sophia Mitchell", detail: "Dermatology · Sydney", rating: 4.5, text: "A longer placeholder: a client might describe what changed at their clinic, what they liked about the service and what they'd like improved next." },
  { language: "en", name: "Dr. Alexander Reed", detail: "Orthodontics · Birmingham", rating: 3, text: "A short placeholder review." },
  { language: "en", name: "Dr. Charlotte Evans", detail: "Cosmetic Dentistry · Dublin", rating: 5, text: "The client's real review appears here, in their own words, once they agree to publish it." },

  // French
  { language: "fr", name: "Dr. Thomas Dubois", detail: "Dentisterie · Paris", rating: 5, text: "Un court avis d'exemple." },
  { language: "fr", name: "Dr. Camille Laurent", detail: "Dermatologie · Lyon", rating: 4.5, text: "L'avis réel du client s'affichera ici, avec ses propres mots, une fois sa publication acceptée." },
  { language: "fr", name: "Dr. Nicolas Moreau", detail: "Chirurgie esthétique · Marseille", rating: 4, text: "Un exemple plus long : le client peut raconter ce qui a changé dans sa clinique, ce qu'il a apprécié et ce qu'il aimerait voir amélioré." },
  { language: "fr", name: "Dr. Sophie Bernard", detail: "Médecine esthétique · Bordeaux", rating: 3.5, text: "Un court avis d'exemple." },
  { language: "fr", name: "Dr. Julien Lefebvre", detail: "Implantologie dentaire · Lille", rating: 5, text: "L'avis réel du client s'affichera ici, avec ses propres mots, une fois sa publication acceptée." },
  { language: "fr", name: "Dr. Emma Martin", detail: "Dermatologie · Nice", rating: 4.5, text: "Un exemple plus long : le client peut raconter ce qui a changé dans sa clinique, ce qu'il a apprécié et ce qu'il aimerait voir amélioré." },
  { language: "fr", name: "Dr. Antoine Girard", detail: "Orthodontie · Toulouse", rating: 3, text: "Un court avis d'exemple." },
  { language: "fr", name: "Dr. Claire Rousseau", detail: "Dentisterie esthétique · Nantes", rating: 5, text: "L'avis réel du client s'affichera ici, avec ses propres mots, une fois sa publication acceptée." },

  // Turkish
  { language: "tr", name: "Dr. Ahmet Yılmaz", detail: "Diş Hekimliği · İstanbul", rating: 5, text: "Kısa bir örnek yorum." },
  { language: "tr", name: "Dr. Elif Demir", detail: "Dermatoloji · Ankara", rating: 4.5, text: "Müşterinin gerçek yorumu, yayın izni verdikten sonra kendi sözleriyle burada görünecek." },
  { language: "tr", name: "Dr. Mehmet Kaya", detail: "Plastik Cerrahi · İzmir", rating: 4, text: "Daha uzun bir örnek: müşteri kliniğinde neyin değiştiğini, hizmette neyi beğendiğini ve neyin geliştirilmesini istediğini anlatabilir." },
  { language: "tr", name: "Dr. Zeynep Çelik", detail: "Estetik Tıp · Antalya", rating: 3.5, text: "Kısa bir örnek yorum." },
  { language: "tr", name: "Dr. Emre Şahin", detail: "Dental İmplantoloji · Bursa", rating: 5, text: "Müşterinin gerçek yorumu, yayın izni verdikten sonra kendi sözleriyle burada görünecek." },
  { language: "tr", name: "Dr. Ayşe Arslan", detail: "Dermatoloji · Gaziantep", rating: 4.5, text: "Daha uzun bir örnek: müşteri kliniğinde neyin değiştiğini, hizmette neyi beğendiğini ve neyin geliştirilmesini istediğini anlatabilir." },
  { language: "tr", name: "Dr. Burak Özdemir", detail: "Ortodonti · Konya", rating: 3, text: "Kısa bir örnek yorum." },
  { language: "tr", name: "Dr. Selin Aydın", detail: "Estetik Diş Hekimliği · İstanbul", rating: 5, text: "Müşterinin gerçek yorumu, yayın izni verdikten sonra kendi sözleriyle burada görünecek." },
];

