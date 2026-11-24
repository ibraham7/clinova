// The seller's identity, shown at the bottom of every legal page (About, Delivery & Returns, Distance Sales).
// Turkish payment providers (iyzico) and the Distance Contracts Regulation expect the trade name, address and tax details
// to be visible. Fill the empty fields with the real registered details: a field left "" is simply not shown.
import { contactEmail, contactPhone, siteName, siteUrl } from "../seo/site";

export const company = {
    brand: siteName,
    /** Registered trade name, e.g. "Example Teknoloji Ltd. Şti." */
    legalName: "",
    /** Registered address, one line. */
    address: "",
    taxOffice: "",
    taxNumber: "",
    /** MERSIS number or trade registry number, if any. */
    registryNumber: "",
    email: contactEmail,
    phone: contactPhone,
    website: siteUrl,
};
