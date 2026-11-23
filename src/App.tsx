import { lazy, Suspense, useEffect, useState } from "react";
import { Box } from "@mui/material";
import OffscreenPause from "./components/motion/OffscreenPause";
import Deferred, { startProgressiveMount, useSectionsEpoch } from "./components/motion/Deferred";
import MouseGlow from "./components/layout/MouseGlow";
import AmbientOrbs from "./components/motion/AmbientOrbs";
import PointerParallax from "./components/motion/PointerParallax";
import ScrollProgress from "./components/motion/ScrollProgress";
import ScrollReveal from "./components/motion/ScrollReveal";
import MotionEngine from "./motion/MotionEngine";
import MobileMotion from "./components/motion/MobileMotion";
import StickyCta from "./components/motion/StickyCta";
import ScrollTopRing from "./motion/ScrollTopRing";
import SectionRail from "./components/motion/SectionRail";
import Header from "./components/layout/Header";
import Hero from "./components/Hero/Hero";
import MedicalTicker from "./components/MedicalTicker/MedicalTicker";
import AboutSection from "./components/AboutSection/AboutSection";
import { siteContent } from "./content/siteContent";
import { displayedReviews } from "./config/clientReviews";
import { showPartners } from "./config/sections";

// Each section below the first screen is its own file, loaded right after the first paint (see components/motion/Deferred.tsx).
const loaders = {
  story: () => import("./components/StorySection/StorySection"),
  reach: () => import("./components/ReachSection/ReachSection"),
  "contact-system": () => import("./components/ContactSection/ContactSection"),
  services: () => import("./components/ServicesSection/ServicesSection"),
  specialties: () => import("./components/SpecialtiesSection/SpecialtiesSection"),
  "case-studies": () => import("./components/CaseStudiesSection/CaseStudiesSection"),
  partners: () => import("./components/PartnersSection/PartnersSection"),
  videos: () => import("./components/ClientVideosSection/ClientVideosSection"),
  reviews: () => import("./components/ReviewsSection/ReviewsSection"),
  faq: () => import("./components/FAQSection/FAQSection"),
  "contact-cta": () => import("./components/CTASection/CTASection"),
  footer: () => import("./components/layout/Footer"),
};
// The trial survey (with the phone-number library behind it) is not needed for the first screen.
const SurveyPopup = lazy(() => import("./components/layout/SurveyPopup"));

function App() {
  const sections = useSectionsEpoch();
  const [survey, setSurvey] = useState(false);
  useEffect(() => {
    startProgressiveMount();
    const timer = window.setTimeout(() => setSurvey(true), 4000);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <Box
      sx={{
        minHeight: "100vh",

        background:
          "radial-gradient(circle at 15% 0%, var(--clinova-rgba-142-168-232-0_1), transparent 30%), var(--clinova-color-0b111b)",
      }}
    >
      <AmbientOrbs />
      <ScrollProgress />
      <ScrollReveal />
      <MotionEngine key={`motion-${sections}`} />
      <PointerParallax />
      <MobileMotion />
      <MouseGlow />
      <Header />
      <Hero />
      <MedicalTicker />
      <AboutSection />
      <Deferred id="story" load={loaders.story} height={2240} />
      <Deferred id="reach" load={loaders.reach} height={890} />
      <Deferred id="contact-system" load={loaders["contact-system"]} height={1345} />
      <Deferred id="services" load={loaders.services} height={960} />
      <Deferred id="specialties" load={loaders.specialties} height={960} />
      <Deferred id="case-studies" load={loaders["case-studies"]} height={1290} />
      {showPartners && <Deferred id="partners" load={loaders.partners} height={775} />}
      {siteContent.videos.length > 0 && <Deferred id="videos" load={loaders.videos} height={700} />}
      {displayedReviews.length > 0 && <Deferred id="reviews" load={loaders.reviews} height={830} />}
      <Deferred id="faq" load={loaders.faq} height={1345} />
      <Deferred id="contact-cta" load={loaders["contact-cta"]} height={590} />
      <Deferred id="footer" load={loaders.footer} height={730} />
      <ScrollTopRing />
      <StickyCta />
      <OffscreenPause key={`pause-${sections}`} />
      <SectionRail key={`rail-${sections}`} />
      {survey && <Suspense fallback={null}><SurveyPopup /></Suspense>}
    </Box>
  );
}

export default App;