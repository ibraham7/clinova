// WhatsApp expects the international number without a plus sign or spaces.
const whatsappNumber = "905516886988";

export const bookingLinkProps = {
    href: `https://wa.me/${whatsappNumber}`,
    target: "_blank",
    rel: "noopener noreferrer",
} as const;

// Only the bottom contact CTA uses this message; top buttons stay direct.
export function bottomBookingLinkProps(message: string) {
    return { ...bookingLinkProps, href: `${bookingLinkProps.href}?text=${encodeURIComponent(message)}` };
}
