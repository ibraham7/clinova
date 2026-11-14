// Used only while prerendering (see Deferred.tsx): the real components, imported directly so the server output is complete.
// This file is never part of the browser bundle.
import type { ComponentType } from "react";
import StorySection from "../StorySection/StorySection";
import ReachSection from "../ReachSection/ReachSection";
import ContactSection from "../ContactSection/ContactSection";
import ServicesSection from "../ServicesSection/ServicesSection";
import SpecialtiesSection from "../SpecialtiesSection/SpecialtiesSection";
import CaseStudiesSection from "../CaseStudiesSection/CaseStudiesSection";
import PartnersSection from "../PartnersSection/PartnersSection";
import ClientVideosSection from "../ClientVideosSection/ClientVideosSection";
import ReviewsSection from "../ReviewsSection/ReviewsSection";
import FAQSection from "../FAQSection/FAQSection";
import CTASection from "../CTASection/CTASection";
import Footer from "../layout/Footer";

export const staticSections: Record<string, ComponentType> = {
    story: StorySection,
    reach: ReachSection,
    "contact-system": ContactSection,
    services: ServicesSection,
    specialties: SpecialtiesSection,
    "case-studies": CaseStudiesSection,
    partners: PartnersSection,
    videos: ClientVideosSection,
    reviews: ReviewsSection,
    faq: FAQSection,
    "contact-cta": CTASection,
    footer: Footer,
};
