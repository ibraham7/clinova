import { sampleReviews } from "./sampleReviews";

export type ClientReview = {
    /** The name the client agreed to show, e.g. "د. ليلى حداد". */
    name: string;
    /** Optional clinic, specialty or city, e.g. "عيادة أسنان · عمّان". */
    detail?: string;
    /** Site language this review is shown in. */
    language: "ar" | "en" | "tr" | "fr";
    /** 1 to 5; halves such as 4.5 are allowed. */
    rating: number;
    /** The client's own words, unedited. */
    text: string;
};

// Real client reviews only, with each client's permission. The average rating and count
// are calculated from this list. Labelled samples keep the section visible while it is empty.
export const clientReviews: ClientReview[] = [];

const samplesAllowed = typeof __CLINOVA_REVIEW_SAMPLES__ !== "undefined" && __CLINOVA_REVIEW_SAMPLES__;

/** Clearly marked placeholder cards appear until real reviews are added. */
export const usingSampleReviews = clientReviews.length === 0 && samplesAllowed;
export const displayedReviews: ClientReview[] = clientReviews.length ? clientReviews : usingSampleReviews ? sampleReviews : [];
