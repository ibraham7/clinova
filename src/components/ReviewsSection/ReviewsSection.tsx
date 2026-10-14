import { useEffect, useRef } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { displayedReviews, usingSampleReviews } from "../../config/clientReviews";
import type { ClientReview } from "../../config/clientReviews";
import CountUp from "../motion/CountUp";

function Stars({ rating, size = 18 }: { rating: number; size?: number }) {
    return <Stack direction="row" dir="ltr" sx={{ gap: 0.1 }}>
        {[0, 1, 2, 3, 4].map((index) => {
            const fill = Math.max(0, Math.min(1, rating - index));
            return <Box key={index} sx={{ position: "relative", width: size, height: size }}>
                <StarRoundedIcon sx={{ position: "absolute", inset: 0, fontSize: size, color: "var(--clinova-rgba-142-168-232-0_2)" }} />
                <Box sx={{ position: "absolute", inset: 0, width: `${fill * 100}%`, overflow: "hidden" }}>
                    <StarRoundedIcon sx={{ fontSize: size, color: "#F5C451", filter: "drop-shadow(0 0 4px rgba(245, 196, 81, 0.45))" }} />
                </Box>
            </Box>;
        })}
    </Stack>;
}

function ReviewCard({ review }: { review: ClientReview }) {
    const { direction } = useSiteTranslation();
    const initials = review.name.split(/\s+/).filter((part) => !/^(د\.|dr\.?)$/i.test(part)).slice(0, 2).map((part) => part[0]).join("");
    return <Box component="article" dir={direction} sx={{
        flex: "0 0 auto", width: { xs: 280, sm: 330 }, minHeight: 230, p: 3, display: "flex", flexDirection: "column", gap: 2,
        borderRadius: "24px", border: "1px solid var(--clinova-rgba-142-168-232-0_14)",
        background: "linear-gradient(160deg, var(--clinova-rgba-142-168-232-0_08), var(--clinova-rgba-142-168-232-0_025) 60%)",
        transition: "transform 600ms cubic-bezier(0.22, 1, 0.36, 1), border-color 500ms ease, box-shadow 600ms ease",
        "&:hover": { transform: "translateY(-6px)", borderColor: "var(--clinova-rgba-142-168-232-0_35)", boxShadow: "0 18px 40px var(--clinova-rgba-0-0-0-0_28)" },
    }}>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Stars rating={review.rating} />
            <FormatQuoteRoundedIcon sx={{ fontSize: 30, color: "var(--clinova-rgba-142-168-232-0_3)", transform: direction === "rtl" ? "scaleX(-1)" : "none" }} />
        </Stack>
        <Typography sx={{ flex: 1, fontSize: "0.9rem", lineHeight: 1.9, color: "var(--clinova-rgba-245-247-250-0_72)" }}>{review.text}</Typography>
        <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
            <Box aria-hidden="true" sx={{ width: 40, height: 40, flexShrink: 0, display: "grid", placeItems: "center", borderRadius: "50%", fontSize: "0.85rem", fontWeight: 700, color: "var(--clinova-color-0b111b)", background: "linear-gradient(135deg, var(--clinova-color-b8c8ef), var(--clinova-color-7894d2))" }}>{initials}</Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--clinova-color-f5f7fa)" }}>{review.name}</Typography>
                {review.detail && <Typography sx={{ fontSize: "0.72rem", color: "text.secondary" }}>{review.detail}</Typography>}
            </Box>
        </Stack>
    </Box>;
}

// Moving the mouse towards an edge glides the reviews that way without clicking; the middle
// of the strip is a calm reading zone. Dragging and touch swiping also work.
function useGlideSlider(startAtEnd: boolean) {
    const track = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const element = track.current;
        if (!element) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let frame = 0;
        let pointerX: number | null = null;
        let velocity = 0;
        let drift = startAtEnd ? -1 : 1;
        let drag: { x: number; start: number } | null = null;
        let position = startAtEnd ? element.scrollWidth : 0;
        element.scrollLeft = position;
        position = element.scrollLeft;

        const tick = () => {
            const max = element.scrollWidth - element.clientWidth;
            // Wheel, keyboard and touch scrolling move the strip too; follow them.
            if (Math.abs(element.scrollLeft - position) > 2) position = element.scrollLeft;
            let target = 0;
            if (pointerX !== null && !drag) {
                const box = element.getBoundingClientRect();
                const ratio = (pointerX - box.left) / box.width;
                const edge = 0.3;
                // Pointer near the right edge: reviews travel right (scroll back); near the left: they travel left.
                if (ratio > 1 - edge) target = -Math.pow((ratio - (1 - edge)) / edge, 2) * 13;
                else if (ratio < edge) target = Math.pow((edge - ratio) / edge, 2) * 13;
            } else if (!drag && !reduced) {
                if (position >= max - 1) drift = -1;
                else if (position <= 1) drift = 1;
                target = drift * 0.35;
            }
            velocity += (target - velocity) * 0.08;
            if (!drag && Math.abs(velocity) > 0.01) {
                position = Math.max(0, Math.min(max, position + velocity));
                element.scrollLeft = position;
            }
            frame = requestAnimationFrame(tick);
        };

        const move = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") return;
            pointerX = event.clientX;
            if (drag) {
                position = Math.max(0, Math.min(element.scrollWidth - element.clientWidth, drag.start - (event.clientX - drag.x)));
                element.scrollLeft = position;
            }
        };
        const leave = () => { pointerX = null; drag = null; };
        const down = (event: PointerEvent) => {
            if (event.pointerType !== "mouse" || event.button !== 0) return;
            drag = { x: event.clientX, start: element.scrollLeft };
            element.setPointerCapture(event.pointerId);
        };
        const up = () => { drag = null; };
        const visible = new IntersectionObserver(([entry]) => {
            cancelAnimationFrame(frame);
            if (entry?.isIntersecting) frame = requestAnimationFrame(tick);
        });

        visible.observe(element);
        element.addEventListener("pointermove", move);
        element.addEventListener("pointerleave", leave);
        element.addEventListener("pointerdown", down);
        element.addEventListener("pointerup", up);
        element.addEventListener("pointercancel", up);
        return () => {
            cancelAnimationFrame(frame);
            visible.disconnect();
            element.removeEventListener("pointermove", move);
            element.removeEventListener("pointerleave", leave);
            element.removeEventListener("pointerdown", down);
            element.removeEventListener("pointerup", up);
            element.removeEventListener("pointercancel", up);
        };
    }, [startAtEnd]);
    return track;
}

export default function ReviewsSection() {
    const { t, direction, isRtl, i18n } = useSiteTranslation();
    const language = i18n.resolvedLanguage ?? "ar";
    const inLanguage = displayedReviews.filter((review) => review.language === language);
    const shown = inLanguage.length ? inLanguage : displayedReviews;
    // The strip runs left-to-right; Arabic starts from the right so the first review sits where reading starts.
    const ordered = isRtl ? [...shown].reverse() : shown;
    const average = displayedReviews.reduce((sum, review) => sum + review.rating, 0) / displayedReviews.length;
    const track = useGlideSlider(isRtl);

    return <Box component="section" id="reviews" sx={{ position: "relative", overflow: "hidden", py: { xs: 10, md: 14 }, direction }}>
        <Container>
            <Stack direction={{ xs: "column", lg: "row" }} sx={{ gap: 4, alignItems: { xs: "center", lg: "flex-end" }, justifyContent: "space-between", textAlign: { xs: "center", lg: "start" }, mb: { xs: 5, md: 7 } }}>
                <Box sx={{ maxWidth: 680 }}>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 0.8, mb: 3, borderRadius: "999px", border: "1px solid var(--clinova-rgba-142-168-232-0_18)", backgroundColor: "var(--clinova-rgba-142-168-232-0_04)" }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "primary.main", boxShadow: "0 0 12px var(--clinova-rgba-142-168-232-0_7)" }} />
                        <Typography sx={{ fontSize: "0.72rem", color: "text.secondary" }}>{t("آراء العملاء")}</Typography>
                    </Box>
                    <Typography component="h2" sx={{ m: 0, fontSize: { xs: "2.4rem", sm: "3.2rem", md: "4.2rem" }, fontWeight: 600, lineHeight: 1.25, color: "var(--clinova-color-f5f7fa)" }}>
                        {t("تقييمات وآراء")}<Box component="span" sx={{ display: "block", color: "primary.main" }}>{t("عملائنا.")}</Box>
                    </Typography>
                </Box>
                <Stack direction="row" sx={{ alignItems: "center", gap: 2.5, px: 3, py: 2.25, borderRadius: "24px", border: "1px solid var(--clinova-rgba-142-168-232-0_18)", background: "linear-gradient(135deg, var(--clinova-rgba-142-168-232-0_1), var(--clinova-rgba-142-168-232-0_025))" }}>
                    <Typography dir="ltr" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: { xs: "2.8rem", md: "3.4rem" }, fontWeight: 600, lineHeight: 1, color: "var(--clinova-color-f5f7fa)" }}>
                        <CountUp value={average.toFixed(1)} />
                    </Typography>
                    <Box>
                        <Stars rating={average} size={22} />
                        <Typography sx={{ mt: 0.75, fontSize: "0.78rem", color: "text.secondary" }}>{t("التقييم العام من {{count}} تقييم", { count: displayedReviews.length })}</Typography>
                    </Box>
                </Stack>
            </Stack>
            {usingSampleReviews && <Stack direction="row" sx={{ alignItems: "center", justifyContent: "center", gap: 1, mb: 3, px: 2, py: 1, borderRadius: 2, color: "warning.light", border: "1px dashed var(--clinova-rgba-142-168-232-0_35)" }}>
                <InfoOutlinedIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: "0.78rem" }}>{t("معاينة فقط: هذه نماذج توضيحية وتظهر هنا حتى تُضاف تقييمات العملاء الحقيقية.")}</Typography>
            </Stack>}
        </Container>
        <Box ref={track} dir="ltr" tabIndex={0} data-reveal-group="" role="region" aria-label={t("تقييمات وآراء عملائنا")} sx={{
            display: "flex", gap: 2.5, overflowX: "auto", py: 2, px: { xs: 2, md: 6 }, cursor: "grab", userSelect: "none", outline: "none",
            scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" },
            "&:active": { cursor: "grabbing" },
            maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        }}>
            {ordered.map((review, index) => <ReviewCard key={`${review.language}-${review.name}-${index}`} review={review} />)}
        </Box>
    </Box>;
}
