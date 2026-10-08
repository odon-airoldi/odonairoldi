import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"

gsap.registerPlugin(useGSAP)

export default function AppIntro({ onDone }) {
    const containerRef = useRef(null);
    const counterRef = useRef(null);

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
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="fixed inset-0 z-50 bg-zinc-950 text-zinc-200 flex items-center justify-center">
            <div className="font-zalando font-stretch-[117.5%] font-extralight text-[6vw] sm:text-[7.5vw]">
                <span ref={counterRef}>0</span>%
            </div>
        </div>
    );
}
