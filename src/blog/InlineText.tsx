import { Box } from "@mui/material";

// Renders **bold** and [label](/path) inside article text.
export default function InlineText({ text }: { text: string }) {
    const parts = text.split(/(\*\*.+?\*\*|\[.+?\]\(.+?\))/g).filter(Boolean);
    return <>{parts.map((part, index) => {
        const bold = /^\*\*(.+)\*\*$/.exec(part);
        if (bold) return <Box component="strong" key={index} sx={{ color: "var(--clinova-color-f5f7fa)", fontWeight: 600 }}>{bold[1]}</Box>;
        const link = /^\[(.+?)\]\((.+?)\)$/.exec(part);
        // Only site paths, anchors and web, mail and phone links become links; anything else stays text.
        if (link && !/^(\/|#|https?:\/\/|mailto:|tel:)/i.test(link[2])) return <span key={index}>{link[1]}</span>;
        if (link) {
            const external = /^https?:/.test(link[2]);
            return <Box component="a" key={index} href={link[2]} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} sx={{
                color: "primary.light", textDecoration: "underline", textDecorationColor: "var(--clinova-rgba-142-168-232-0_35)", textUnderlineOffset: "4px",
                transition: "text-decoration-color 400ms ease", "&:hover": { textDecorationColor: "currentColor" },
            }}>{link[1]}</Box>;
        }
        return <span key={index}>{part}</span>;
    })}</>;
}
