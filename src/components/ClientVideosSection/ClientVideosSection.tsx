import { useState } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
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
    const { t, direction, i18n } = useSiteTranslation();
    const lang = i18n.resolvedLanguage ?? "ar";
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
            <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" } }}>
                {siteContent.videos.map((video) => {
                    const details = localized(video.details, lang);
                    const quote = localized(video.quote, lang);
                    return <Box component="article" key={video.id} sx={{
                        borderRadius: "24px", overflow: "hidden", border: "1px solid var(--clinova-rgba-142-168-232-0_14)",
                        background: "linear-gradient(160deg, var(--clinova-rgba-142-168-232-0_08), var(--clinova-rgba-142-168-232-0_025) 60%)",
                        transition: "transform 600ms cubic-bezier(0.22, 1, 0.36, 1), border-color 500ms ease, box-shadow 600ms ease",
                        "&:hover": { transform: "translateY(-6px)", borderColor: "var(--clinova-rgba-142-168-232-0_35)", boxShadow: "0 18px 40px var(--clinova-rgba-0-0-0-0_28)" },
                    }}>
                        <Box sx={{ position: "relative", aspectRatio: "16 / 9", backgroundColor: "#000" }}><VideoPlayer video={video} /></Box>
                        <Stack sx={{ p: 2.5, gap: 1 }}>
                            {quote && <Stack direction="row" sx={{ gap: 1 }}>
                                <FormatQuoteRoundedIcon sx={{ fontSize: 22, color: "var(--clinova-rgba-142-168-232-0_45)", flexShrink: 0, transform: direction === "rtl" ? "scaleX(-1)" : "none" }} />
                                <Typography sx={{ fontSize: "0.9rem", lineHeight: 1.85, color: "var(--clinova-rgba-245-247-250-0_72)" }}>{quote}</Typography>
                            </Stack>}
                            <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--clinova-color-f5f7fa)" }}>{video.name}</Typography>
                            {details && <Typography sx={{ fontSize: "0.76rem", color: "text.secondary" }}>{details}</Typography>}
                        </Stack>
                    </Box>;
                })}
            </Box>
        </Container>
    </Box>;
}
