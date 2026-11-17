import { Box } from "@mui/material";

const radius = 86;
const circumference = 2 * Math.PI * radius;

/**
 * A dial beside the questions (wide screens only): the ring fills up to the open question, the needle jumps to the one
 * under the mouse, and the numbered keys open a question directly. It repeats the list for the eyes only, so it is hidden
 * from screen readers and skipped by the keyboard (the questions themselves are the real controls).
 */
export default function FaqDial({ ids, activeId, hoverId, onPick }: { ids: string[]; activeId: string; hoverId: string; onPick: (id: string) => void }) {
    const count = ids.length;
    const activeIndex = ids.indexOf(activeId);
    const pointId = hoverId || activeId;
    const pointIndex = ids.indexOf(pointId);
    const angle = (index: number) => ((index + 1) * 360) / count;
    return <Box aria-hidden="true" className="faq-dial">
        <div className={`faq-dial-face${hoverId && hoverId !== activeId ? " is-peek" : ""}`}>
            <svg viewBox="0 0 200 200" focusable="false">
                <circle className="faq-dial-track" cx="100" cy="100" r={radius} />
                <circle className="faq-dial-progress" cx="100" cy="100" r={radius} transform="rotate(-90 100 100)"
                    style={{ strokeDasharray: circumference, strokeDashoffset: circumference * (1 - (activeIndex + 1) / count) }} />
                {ids.map((id, index) => <line key={id} className={`faq-dial-tick${index <= activeIndex ? " is-done" : ""}${index === pointIndex ? " is-point" : ""}`}
                    x1="100" y1="22" x2="100" y2={index === pointIndex ? 36 : 29} transform={`rotate(${angle(index)} 100 100)`} />)}
            </svg>
            <div className="faq-dial-needle" style={{ rotate: `${pointIndex < 0 ? 0 : angle(pointIndex)}deg`, opacity: pointIndex < 0 ? 0 : 1 }}><i /></div>
            <div className="faq-dial-num" dir="ltr">
                <span key={pointId || "none"}>{pointId || "··"}</span>
                <small>/ {String(count).padStart(2, "0")}</small>
            </div>
        </div>
        <div className="faq-dial-keys" dir="ltr" style={{ gridTemplateColumns: `repeat(${count % 4 === 0 ? 4 : count % 3 === 0 ? 3 : 5}, 1fr)` }}>
            {ids.map((id) => <button key={id} type="button" tabIndex={-1} className={id === activeId ? "is-active" : id === hoverId ? "is-peek" : undefined} onClick={() => onPick(id)}>{id}</button>)}
        </div>
    </Box>;
}
