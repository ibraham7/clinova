import { Box, Container, Typography } from "@mui/material";
import type { SiteLanguage } from "../i18n";
import { useSiteTranslation } from "../i18n/useSiteTranslation";
import BlogLayout from "../blog/BlogLayout";
import InlineText from "../blog/InlineText";
import { formatDate } from "../blog/format";
import { company } from "./company";
import { legalDocs, legalUpdated, type LegalSlug } from "./docs";

const bodySx = { fontSize: { xs: "1rem", md: "1.04rem" }, lineHeight: 2, color: "var(--clinova-rgba-245-247-250-0_72)" };

const labels: Record<SiteLanguage, Record<string, string>> = {
    ar: { seller: "بيانات البائع", name: "الاسم التجاري", legalName: "الاسم القانوني", address: "العنوان", taxOffice: "الدائرة الضريبية", taxNumber: "الرقم الضريبي", registry: "رقم السجل / ميرسيس", email: "البريد الإلكتروني", phone: "الهاتف", website: "الموقع" },
    en: { seller: "Seller details", name: "Brand", legalName: "Legal name", address: "Address", taxOffice: "Tax office", taxNumber: "Tax number", registry: "Registry / MERSIS no.", email: "Email", phone: "Phone", website: "Website" },
    tr: { seller: "Satıcı bilgileri", name: "Marka", legalName: "Unvan", address: "Adres", taxOffice: "Vergi dairesi", taxNumber: "Vergi numarası", registry: "Sicil / MERSİS no", email: "E-posta", phone: "Telefon", website: "Web sitesi" },
    fr: { seller: "Informations du vendeur", name: "Marque", legalName: "Raison sociale", address: "Adresse", taxOffice: "Centre des impôts", taxNumber: "Numéro fiscal", registry: "N° de registre / MERSIS", email: "E-mail", phone: "Téléphone", website: "Site web" },
};

/** One of the legal pages (About, Delivery and Returns, Distance Sales): the text plus the seller's identity underneath. */
export default function LegalPage({ slug }: { slug: LegalSlug }) {
    const { i18n } = useSiteTranslation();
    const lang = (i18n.resolvedLanguage ?? "ar") as SiteLanguage;
    const text = legalDocs[slug][lang];
    const l = labels[lang];
    const rows: [string, string, boolean?][] = [
        [l.name, company.brand],
        [l.legalName, company.legalName],
        [l.address, company.address],
        [l.taxOffice, company.taxOffice],
        [l.taxNumber, company.taxNumber, true],
        [l.registry, company.registryNumber, true],
        [l.email, company.email, true],
        [l.phone, company.phone, true],
        [l.website, company.website, true],
    ];
    return <BlogLayout>
        <Container maxWidth="md" component="article" sx={{ py: { xs: 5, md: 8 } }}>
            <Typography component="h1" sx={{ fontSize: { xs: "1.9rem", md: "2.6rem" }, fontWeight: 700, color: "var(--clinova-color-f5f7fa)" }}>{text.title}</Typography>
            <Typography sx={{ mt: 1.5, fontSize: "0.82rem", color: "text.secondary" }}>{text.updated}: <time dateTime={legalUpdated}>{formatDate(legalUpdated, lang)}</time></Typography>
            {text.sections.map((section) => <Box component="section" key={section.heading} sx={{ mt: 4 }}>
                <Typography component="h2" sx={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--clinova-color-f5f7fa)", mb: 1.5 }}>{section.heading}</Typography>
                {section.paragraphs.map((paragraph) => <Typography key={paragraph.slice(0, 40)} sx={{ ...bodySx, mb: 1.5 }}><InlineText text={paragraph} /></Typography>)}
            </Box>)}
            <Box component="section" sx={{ mt: 5, p: 2.5, borderRadius: "16px", border: "1px solid var(--clinova-rgba-142-168-232-0_22)" }}>
                <Typography component="h2" sx={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--clinova-color-f5f7fa)", mb: 1.5 }}>{l.seller}</Typography>
                <Box component="dl" sx={{ m: 0, display: "grid", gridTemplateColumns: "max-content 1fr", columnGap: 2, rowGap: 0.75 }}>
                    {rows.filter(([, value]) => value).map(([label, value, ltr]) => <Box key={label} sx={{ display: "contents" }}>
                        <Typography component="dt" sx={{ ...bodySx, lineHeight: 1.8, fontWeight: 600 }}>{label}</Typography>
                        <Typography component="dd" sx={{ ...bodySx, lineHeight: 1.8, m: 0 }} dir={ltr ? "ltr" : undefined}>
                            {label === l.email ? <a href={`mailto:${value}`} style={{ color: "inherit" }}>{value}</a> : label === l.phone ? <a href={`tel:${value}`} style={{ color: "inherit" }}>{value}</a> : value}
                        </Typography>
                    </Box>)}
                </Box>
            </Box>
        </Container>
    </BlogLayout>;
}
