import { useRef, useState } from "react";
import { Box, ButtonBase, Container, IconButton, Stack, Typography, useMediaQuery } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import { useSiteTranslation } from "../../i18n/useSiteTranslation";
import { localized, siteContent, videoPoster, youtubeId, type ClientVideo } from "../../content/siteContent";

/** YouTube loads only after a tap (fast pages, no tracking before play); uploaded videos use the native player. */
function VideoPlayer({ video }: { video: ClientVideo }) {
    const { t } = useSiteTranslation();
    const [playing, setPlaying] = useState(false);
    const id = youtubeId(video.url);
    const poster = videoPoster(video);
    const frame = { position: "absolute" as const, inset: 0, width: "100%", height: "100%", border: 0 };
    if (!id) return <Box component="video" src={video.url} poster={poster} controls preload="none" playsInline sx={{ ...frame, objectFit: "cover", backgroundColor: "#000" }} />;
    if (playing) return <Box component="iframe" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={video.name} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen sx={frame} />;
    return <Box component="button" type="button" onClick={() => setPlaying(true)} aria-label={`${t("تشغيل الفيديو")}: ${video.name}`} sx={{
        ...frame, p: 0, cursor: "pointer", display: "grid", placeItems: "center", background: "#000",
        "& img": { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.8, transition: "opacity 500ms ease, scale 700ms cubic-bezier(0.22, 1, 0.36, 1)" },
        "&:hover img": { opacity: 1, scale: "1.04" },
        "&:hover .play": { scale: "1.08" },
    }}>
        {poster && <img src={poster} alt="" loading="lazy" />}
        <Box className="play" sx={{
            position: "relative", width: 68, height: 68, borderRadius: "50%", display: "grid", placeItems: "center",
            color: "var(--clinova-color-0b111b)", background: "linear-gradient(135deg, var(--clinova-color-b8c8ef), var(--clinova-color-8ea8e8))",
            boxShadow: "0 0 0 10px var(--clinova-rgba-142-168-232-0_2), 0 12px 32px var(--clinova-rgba-0-0-0-0_4)",
            transition: "scale 500ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}><PlayArrowRoundedIcon sx={{ fontSize: 38 }} /></Box>
    </Box>;
}

export default function ClientVideosSection() {
    const { t, direction } = useSiteTranslation();
    return <Box component="section" id="client-videos" sx={{ position: "relative", py: { xs: 10, md: 14 }, direction }}>
        <Container>
            <Box sx={{ maxWidth: 680, mb: { xs: 5, md: 7 }, textAlign: { xs: "center", lg: "start" } }}>
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 0.8, mb: 3, borderRadius: "999px", border: "1px solid var(--clinova-rgba-142-168-232-0_18)", backgroundColor: "var(--clinova-rgba-142-168-232-0_04)" }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "primary.main", boxShadow: "0 0 12px var(--clinova-rgba-142-168-232-0_7)" }} />
                    <Typography sx={{ fontSize: "0.72rem", color: "text.secondary" }}>{t("ماذا يقول أصحاب العيادات؟")}</Typography>
                </Box>
                <Typography component="h2" sx={{ m: 0, fontSize: { xs: "2.4rem", sm: "3.2rem", md: "4.2rem" }, fontWeight: 600, lineHeight: 1.25, color: "var(--clinova-color-f5f7fa)" }}>
                    {t("تجارب حقيقية.")}<Box component="span" sx={{ display: "block", color: "primary.main" }}>{t("من أصحاب العيادات.")}</Box>
                </Typography>
            </Box>
            <VideoPages />
        </Container>
    </Box>;
}

const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

function VideoCard({ video, visible }: { video: ClientVideo; visible: boolean }) {
    const { direction, i18n } = useSiteTranslation();
    const lang = i18n.resolvedLanguage ?? "ar";
    const details = localized(video.details, lang);
    const quote = localized(video.quote, lang);
    return <Box component="article" sx={{
        height: "100%", borderRadius: "24px", overflow: "hidden", border: "1px solid var(--clinova-rgba-142-168-232-0_14)",
        background: "linear-gradient(160deg, var(--clinova-rgba-142-168-232-0_08), var(--clinova-rgba-142-168-232-0_025) 60%)",
        transition: `transform 600ms ${ease}, border-color 500ms ease, box-shadow 600ms ease`,
        "&:hover": { transform: "translateY(-6px)", borderColor: "var(--clinova-rgba-142-168-232-0_35)", boxShadow: "0 18px 40px var(--clinova-rgba-0-0-0-0_28)" },
    }}>
        <Box sx={{ position: "relative", aspectRatio: "16 / 9", backgroundColor: "#000" }}>{/* A new player when the card leaves or enters view: a video left playing on another page stops. */}
            <VideoPlayer key={String(visible)} video={video} /></Box>
        <Stack sx={{ p: 2.5, gap: 1 }}>
            {quote && <Stack direction="row" sx={{ gap: 1 }}>
                <FormatQuoteRoundedIcon sx={{ fontSize: 22, color: "var(--clinova-rgba-142-168-232-0_45)", flexShrink: 0, transform: direction === "rtl" ? "scaleX(-1)" : "none" }} />
                <Typography sx={{ fontSize: "0.9rem", lineHeight: 1.85, color: "var(--clinova-rgba-245-247-250-0_72)" }}>{quote}</Typography>
            </Stack>}
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--clinova-color-f5f7fa)" }}>{video.name}</Typography>
            {details && <Typography sx={{ fontSize: "0.76rem", color: "text.secondary" }}>{details}</Typography>}
        </Stack>
    </Box>;
}

/**
 * Up to 3 videos (2 on tablets, 1 on phones) show at a time. With more, the rest sit on further pages that
 * slide in with the arrows, the dots or a swipe; pages out of view are hidden from screen readers and keyboards.
 */
function VideoPages() {
    const { t, direction } = useSiteTranslation();
    const wide = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
    const medium = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));
    const perPage = wide ? 3 : medium ? 2 : 1;
    const videos = siteContent.videos;
    const pages = Array.from({ length: Math.ceil(videos.length / perPage) }, (_, index) => videos.slice(index * perPage, index * perPage + perPage));
    const [page, setPage] = useState(0);
    const current = Math.min(page, pages.length - 1);
    const rtl = direction === "rtl";
    const go = (next: number) => setPage(Math.max(0, Math.min(pages.length - 1, next)));
    const touch = useRef<number | null>(null);
    const columns = { gridTemplateColumns: `repeat(${perPage}, minmax(0, 1fr))` };

    if (pages.length <= 1) return <Box sx={{ display: "grid", gap: 3, ...columns }}>
        {videos.map((video) => <VideoCard key={video.id} video={video} visible />)}
    </Box>;

    // "Back" points to where the previous page sits: right in Arabic, left in the other languages.
    const arrow = (step: -1 | 1) => {
        const Icon = (step === 1) === rtl ? ChevronLeftRoundedIcon : ChevronRightRoundedIcon;
        const disabled = step === -1 ? current === 0 : current === pages.length - 1;
        return <IconButton onClick={() => go(current + step)} disabled={disabled} aria-label={t(step === 1 ? "الفيديوهات التالية" : "الفيديوهات السابقة")} sx={{
            width: 48, height: 48, color: "var(--clinova-color-f5f7fa)", border: "1px solid var(--clinova-rgba-142-168-232-0_25)",
            backgroundColor: "var(--clinova-rgba-142-168-232-0_06)", transition: `background-color 400ms ease, transform 500ms ${ease}, opacity 400ms ease`,
            "&:hover": { backgroundColor: "var(--clinova-rgba-142-168-232-0_16)", transform: `translateX(${(step === 1) === rtl ? -3 : 3}px)` },
            "&.Mui-disabled": { opacity: 0.3, color: "var(--clinova-color-f5f7fa)" },
        }}><Icon /></IconButton>;
    };

    return <Box>
        <Box sx={{ overflow: "hidden", mx: -1.5, px: 1.5, py: 1.5, my: -1.5 }}
            onTouchStart={(event) => { touch.current = event.touches[0].clientX; }}
            onTouchEnd={(event) => {
                if (touch.current === null) return;
                const moved = event.changedTouches[0].clientX - touch.current;
                touch.current = null;
                if (Math.abs(moved) > 50) go(current + ((moved < 0) !== rtl ? 1 : -1));
            }}>
            <Box sx={{ display: "flex", transform: `translateX(${(rtl ? 1 : -1) * current * 100}%)`, transition: `transform 800ms ${ease}` }}>
                {pages.map((items, index) => {
                    const visible = index === current;
                    return <Box key={index} aria-hidden={!visible} inert={!visible} sx={{
                        flex: "0 0 100%", display: "grid", gap: 3, alignContent: "start", ...columns,
                        opacity: visible ? 1 : 0.25, transform: visible ? "scale(1)" : "scale(0.94)", filter: visible ? "none" : "blur(2px)",
                        transition: `opacity 700ms ease, transform 800ms ${ease}, filter 700ms ease`,
                    }}>
                        {items.map((video, position) => <Box key={video.id} sx={{
                            height: "100%", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(18px)",
                            transition: `opacity 600ms ease ${visible ? 150 + position * 90 : 0}ms, transform 800ms ${ease} ${visible ? 150 + position * 90 : 0}ms`,
                        }}><VideoCard video={video} visible={visible} /></Box>)}
                    </Box>;
                })}
            </Box>
        </Box>
        <Stack direction="row" sx={{ mt: { xs: 4, md: 5 }, alignItems: "center", justifyContent: "center", gap: 2.5 }}>
            {arrow(-1)}
            <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
                {pages.map((_, index) => <ButtonBase key={index} onClick={() => go(index)} aria-label={t("صفحة الفيديوهات {{page}}", { page: index + 1 })} aria-current={index === current ? "true" : undefined} sx={{
                    width: index === current ? 28 : 8, height: 8, borderRadius: "999px",
                    backgroundColor: index === current ? "primary.main" : "var(--clinova-rgba-142-168-232-0_3)",
                    boxShadow: index === current ? "0 0 14px var(--clinova-rgba-142-168-232-0_5)" : "none",
                    transition: `width 600ms ${ease}, background-color 400ms ease, box-shadow 400ms ease`,
                }} />)}
            </Stack>
            {arrow(1)}
        </Stack>
    </Box>;
}
