import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useLayoutEffect, useMemo } from "react";

gsap.registerPlugin(useGSAP);

export default function AppLogo({
    size = 136,                // larghezza dell'svg in px (l'altezza è sempre size/2) — range consigliato: 40–400
    amplitude = 4,             // spostamento massimo in px sulla punta libera dell'onda — range consigliato: 0 (piatto) – 15 (oltre inizia a deformarsi troppo)
    frequency = Math.PI * 16,   // quante creste ha l'onda lungo la profondità (0..1) — range consigliato: Math.PI * 0.5 (larga) – Math.PI * 3 (frastagliata)
    speed = 3.0,               // velocità di avanzamento della fase nel tempo (rad/sec) — range consigliato: 0 (ferma) – 4 (molto veloce)
    edgePoints = 60,           // punti campionati su ciascun lato del triangolo — range consigliato: 8 (poco morbido) – 60 (oltre, costo inutile)
    arcPoints = 60,            // punti campionati lungo l'arco del semicerchio — range consigliato: 8 – 60, stessa logica di edgePoints
}) {
    const SIZE = 135.764502;
    const HALF = SIZE / 2;
    const R = 46;
    const triangleRef = useRef(null);
    const circleRef = useRef(null);

    const { buildTrianglePath, buildCirclePath } = useMemo(() => {
        const lerp = (a, b, f) => a + (b - a) * f;
        const waveOffset = (y, t) => {
            const progress = (y - HALF) / (SIZE - HALF);
            return amplitude * progress * Math.sin(frequency * progress - t);
        };
        const toD = (pts) =>
            "M" + pts.map((p) => p[0].toFixed(2) + "," + p[1].toFixed(2)).join("L") + "Z";

        return {
            buildTrianglePath: (t) => {
                const pts = [];
                for (let i = 0; i <= edgePoints; i++) {
                    const f = i / edgePoints, x0 = lerp(0, HALF, f), y0 = lerp(HALF, SIZE, f);
                    pts.push([x0 + waveOffset(y0, t), y0]);
                }
                for (let i = 1; i <= edgePoints; i++) {
                    const f = i / edgePoints, x0 = lerp(HALF, SIZE, f), y0 = lerp(SIZE, HALF, f);
                    pts.push([x0 + waveOffset(y0, t), y0]);
                }
                return toD(pts);
            },
            buildCirclePath: (t) => {
                const pts = [];
                for (let i = 0; i <= arcPoints; i++) {
                    const theta = (i / arcPoints) * Math.PI;
                    const x0 = HALF + R * Math.cos(theta), y0 = HALF + R * Math.sin(theta);
                    pts.push([x0 + waveOffset(y0, t), y0]);
                }
                return toD(pts);
            },
        };
    }, [amplitude, frequency, edgePoints, arcPoints]);

    useLayoutEffect(() => {
        const tick = (elapsed) => {
            const t = elapsed * speed;
            triangleRef.current.setAttribute("d", buildTrianglePath(t));
            circleRef.current.setAttribute("d", buildCirclePath(t));
        };
        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
    }, [buildTrianglePath, buildCirclePath, speed]);

    return (
        <div>
            <svg width="136" height="68" viewBox="0 0 135.764502 67.882251" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,67.882251 L67.882251,0 L135.764502,67.882251 Z" fill="oklch(96.3% 0.002 197.1)" />
                <path d="M21.882251,67.882251 A46,46 0 0 1 113.882251,67.882251 Z" fill="oklch(21% 0.006 285.885)" />
            </svg>

            <svg width={size} height={size / 2} viewBox={`0 ${HALF} ${SIZE} ${HALF}`}>
                <defs>
                    <linearGradient id="ciao" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(37% 0.013 285.805)" />
                        {/* <stop offset="25%" stopColor="oklch(27.4% 0.006 286.033)" />
                        <stop offset="50%" stopColor="oklch(21% 0.006 285.885)" />
                        <stop offset="75%" stopColor="oklch(27.4% 0.006 286.033)" /> */}
                        <stop offset="100%" stopColor="oklch(21% 0.006 285.885)" />
                    </linearGradient>
                </defs>
                <path ref={triangleRef} fill={`url(#ciao)`} />
                <path ref={circleRef} fill="oklch(21% 0.006 285.885)" />
            </svg>
        </div>
    );
}
