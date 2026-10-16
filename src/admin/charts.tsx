import { useState } from "react";
import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { chart, formatNumber } from "./chartTheme";
import { isRtl } from "./i18n";

// Small SVG/HTML charts for the reports page. One series per chart, one hue (brand blue on the dark panel),
// values always written next to the marks so the hover tooltip only adds detail.

/** Positioned in percent of the chart box, so it follows the responsive SVG. */
function Tooltip({ x, y, children }: { x: string; y: string; children: ReactNode }) {
    return <Box role="tooltip" sx={{
        position: "absolute", left: x, top: y, transform: "translate(-50%, calc(-100% - 10px))", pointerEvents: "none", zIndex: 2, whiteSpace: "nowrap",
        px: 1.25, py: 0.75, borderRadius: "10px", fontSize: "0.78rem", color: chart.text, backgroundColor: "#1A2638", border: "1px solid rgba(142,168,232,0.3)", boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
    }}>{children}</Box>;
}

export type Marker = { date: string; label: string };

/** Daily line with a crosshair; amber dashed lines mark articles and site changes. */
export function DailyChart({ data, label, markers }: { data: { date: string; value: number }[]; label: string; markers: Marker[] }) {
    const [hover, setHover] = useState<number | null>(null);
    const width = 760, height = 220, left = 40, right = 12, top = 16, bottom = 28;
    const max = Math.max(1, ...data.map((point) => point.value));
    const step = data.length > 1 ? (width - left - right) / (data.length - 1) : 0;
    // Right-to-left panel: time still reads left to right, like every calendar chart.
    const x = (index: number) => left + index * step;
    const y = (value: number) => top + (1 - value / max) * (height - top - bottom);
    const ticks = [0, Math.round(max / 2), max];
    const path = data.map((point, index) => `${index ? "L" : "M"}${x(index).toFixed(1)},${y(point.value).toFixed(1)}`).join(" ");
    const area = data.length ? `${path} L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z` : "";
    const labelEvery = Math.max(1, Math.ceil(data.length / 8));
    const markerIndex = markers.map((marker) => ({ ...marker, index: data.findIndex((point) => point.date === marker.date) })).filter((marker) => marker.index >= 0);
    const onMove = (event: React.PointerEvent<SVGRectElement>) => {
        const box = event.currentTarget.getBoundingClientRect();
        const svgX = ((event.clientX - box.left) / box.width) * (width - left - right);
        setHover(Math.max(0, Math.min(data.length - 1, Math.round(step ? svgX / step : 0))));
    };
    const point = hover === null ? null : data[hover];
    const hoverMarkers = point ? markerIndex.filter((marker) => marker.index === hover) : [];
    return <Box dir="ltr" sx={{ position: "relative" }}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label={label} style={{ display: "block", overflow: "visible" }}>
            {ticks.map((tick) => <g key={tick}>
                <line x1={left} x2={width - right} y1={y(tick)} y2={y(tick)} stroke={chart.grid} />
                <text x={left - 8} y={y(tick) + 4} textAnchor="end" fontSize="11" fill={chart.axis}>{formatNumber(tick)}</text>
            </g>)}
            {data.map((point, index) => index % labelEvery === 0 && <text key={point.date} x={x(index)} y={height - 8} textAnchor="middle" fontSize="11" fill={chart.axis}>{point.date.slice(5)}</text>)}
            {markerIndex.map((marker) => <line key={`${marker.date}-${marker.label}`} x1={x(marker.index)} x2={x(marker.index)} y1={top} y2={y(0)} stroke={chart.event} strokeDasharray="4 4" strokeWidth={1.5} />)}
            <path d={area} fill={chart.mark} opacity={0.12} />
            <path d={path} fill="none" stroke={chart.mark} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {hover !== null && point && <>
                <line x1={x(hover)} x2={x(hover)} y1={top} y2={y(0)} stroke={chart.axis} strokeWidth={1} />
                <circle cx={x(hover)} cy={y(point.value)} r={5} fill={chart.mark} stroke={chart.surface} strokeWidth={2} />
            </>}
            <rect x={left} y={0} width={width - left - right} height={height - bottom} fill="transparent" onPointerMove={onMove} onPointerLeave={() => setHover(null)} />
        </svg>
        {hover !== null && point && <Tooltip x={`${(x(hover) / width) * 100}%`} y={`${(y(point.value) / height) * 100}%`}>
            <Box dir={isRtl() ? "rtl" : "ltr"}><Box component="strong" sx={{ fontSize: "0.95rem" }}>{formatNumber(point.value)}</Box> <Box component="span" sx={{ color: chart.muted }}>{label} · {point.date}</Box>
                {hoverMarkers.map((marker) => <Box key={marker.label} sx={{ color: chart.event, mt: 0.25 }}>{marker.label}</Box>)}</Box>
        </Tooltip>}
    </Box>;
}

export type BarRow = { key: string; label: string; value: number; display?: string; note?: string };

/** Horizontal bars, longest first, value written at the end of each bar. */
export function BarList({ rows, empty, max }: { rows: BarRow[]; empty: string; max?: number }) {
    const [hover, setHover] = useState<string | null>(null);
    if (!rows.length) return <Typography sx={{ color: chart.muted, fontSize: "0.85rem", py: 2 }}>{empty}</Typography>;
    const top = max ?? Math.max(1, ...rows.map((row) => row.value));
    return <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1 }}>
        {rows.map((row) => <Box component="li" key={row.key} tabIndex={0} onPointerEnter={() => setHover(row.key)} onPointerLeave={() => setHover(null)} onFocus={() => setHover(row.key)} onBlur={() => setHover(null)}
            title={row.note ? `${row.label}: ${row.display ?? formatNumber(row.value)} — ${row.note}` : undefined} sx={{ outline: "none", py: 0.25 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, fontSize: "0.84rem", mb: 0.5 }}>
                <Box component="span" sx={{ color: chart.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.label}</Box>
                <Box component="span" sx={{ color: chart.text, fontWeight: 600, flexShrink: 0 }}>{row.display ?? formatNumber(row.value)}{row.note && <Box component="span" sx={{ color: chart.muted, fontWeight: 400, ms: 1 }}> · {row.note}</Box>}</Box>
            </Box>
            <Box sx={{ height: 8, borderRadius: "4px", backgroundColor: "rgba(142,168,232,0.08)" }}>
                <Box sx={{ height: "100%", width: `${Math.max(1.5, (row.value / top) * 100)}%`, borderRadius: "4px", backgroundColor: hover === row.key ? chart.markHover : chart.mark, transition: "width 500ms ease, background-color 200ms ease" }} />
            </Box>
        </Box>)}
    </Box>;
}

/** Visitors by hour of day: 24 thin columns. */
export function HourChart({ data, label }: { data: { hour: number; visitors: number }[]; label: string }) {
    const [hover, setHover] = useState<number | null>(null);
    const max = Math.max(1, ...data.map((row) => row.visitors));
    const width = 480, height = 140, bottom = 20, gap = 2;
    const barWidth = width / 24 - gap;
    const point = hover === null ? null : data[hover];
    return <Box dir="ltr" sx={{ position: "relative" }}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label={label} style={{ display: "block", overflow: "visible" }}>
            {data.map((row) => {
                const barHeight = Math.max(row.visitors ? 3 : 0, (row.visitors / max) * (height - bottom - 8));
                const x = row.hour * (barWidth + gap);
                return <g key={row.hour} onPointerEnter={() => setHover(row.hour)} onPointerLeave={() => setHover(null)}>
                    <rect x={x - gap / 2} y={0} width={barWidth + gap} height={height} fill="transparent" />
                    <path d={`M${x},${height - bottom} v${-Math.max(0, barHeight - 4)} q0,-4 4,-4 h${barWidth - 8} q4,0 4,4 v${Math.max(0, barHeight - 4)} z`} fill={hover === row.hour ? chart.markHover : chart.mark} opacity={row.visitors ? 1 : 0} />
                    {row.hour % 3 === 0 && <text x={x + barWidth / 2} y={height - 4} textAnchor="middle" fontSize="11" fill={chart.axis}>{row.hour}</text>}
                </g>;
            })}
            <line x1={0} x2={width} y1={height - bottom} y2={height - bottom} stroke={chart.grid} />
        </svg>
        {point && <Tooltip x={`${((point.hour * (barWidth + gap) + barWidth / 2) / width) * 100}%`} y="15%">
            <Box dir={isRtl() ? "rtl" : "ltr"}><Box component="strong">{formatNumber(point.visitors)}</Box> <Box component="span" sx={{ color: chart.muted }}>{label} · {point.hour}:00</Box></Box>
        </Tooltip>}
    </Box>;
}
