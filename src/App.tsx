import { Box } from "@mui/material";
import Header from "./components/layout/Header";
import Hero from "./components/Hero/Hero";
import MedicalTicker from "./components/MedicalTicker/MedicalTicker";
import AboutSection from "./components/AboutSection/AboutSection";
import StorySection from "./components/StorySection/StorySection";
import ReachSection from "./components/ReachSection/ReachSection";
import ContactSection from "./components/ContactSection/ContactSection";
import ServicesSection from "./components/ServicesSection/ServicesSection";
import SpecialtiesSection from "./components/SpecialtiesSection/SpecialtiesSection";
import CaseStudiesSection from "./components/CaseStudiesSection/CaseStudiesSection";
import PartnersSection from "./components/PartnersSection/PartnersSection";
import TestimonialsSection from "./components/TestimonialsSection/TestimonialsSection";
import FAQSection from "./components/FAQSection/FAQSection";
import CTASection from "./components/CTASection/CTASection";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",

        background:
          "radial-gradient(circle at 15% 0%, rgba(142,168,232,0.10), transparent 30%), #0B111B",
      }}
    >
      <Header />
      <Hero />
      <MedicalTicker />
      <AboutSection />
      <StorySection />
      <ReachSection />
      <ContactSection />
      <ServicesSection />
      <SpecialtiesSection />
      <CaseStudiesSection />
      <PartnersSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </Box>
  );
}

export default App;