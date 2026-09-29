import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"
import AppLogo from "./AppLogo"

gsap.registerPlugin(useGSAP)

export default function AppIntro({ onDone }) {
    const containerRef = useRef(null);
    const counterRef = useRef(null);
    const cursorRef = useRef(null);

    useGSAP(() => {
        const counter = { value: 0 };

        gsap.to(counter, {
            value: 100,
            duration: 3,
            ease: "power2.out",
            onUpdate: () => {
                counterRef.current.textContent = Math.round(counter.value);
            },
            onComplete: () => {
                gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: 1,
                    ease: "power1.out",
                    onComplete: onDone,
                });
            },
        });

        // il numero sostituisce il puntatore del mouse: la freccia nativa è nascosta
        // (cursor-none sul contenitore) e questo elemento segue la posizione reale del
        // mouse, con un piccolo offset per non stare esattamente sotto la punta. Non c'è
        // modo di conoscere la posizione del mouse prima che si muova almeno una volta,
        // quindi resta invisibile finché non arriva il primo mousemove — evita che compaia
        // per un istante in alto a sinistra (0,0) prima di raggiungere la posizione vera
        gsap.set(cursorRef.current, { opacity: 0 });
        const handleMove = (e) => {
            gsap.set(cursorRef.current, { x: e.clientX + 16, y: e.clientY + 16, opacity: 1 });
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="fixed inset-0 z-50 bg-zinc-950 text-zinc-200 cursor-none">
            <div ref={cursorRef} className="text-2xl font-extralight font-zalando-expanded pointer-events-none">
                <span ref={counterRef}>0</span>%
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[2]">
                <AppLogo />
            </div>
        </div>
    );
}
