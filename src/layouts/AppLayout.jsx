import { useRef } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useAppContext } from "../contexts/AppContext"
import { setElement, toElement, setWordReveal, toWordReveal } from "../utils/gsap"

import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

gsap.registerPlugin(useGSAP);

export default function AppLayout() {

    const { cursorRef, showSplash } = useAppContext();
    const { pathname } = useLocation();
    const layoutRef = useRef(null);

    // le animazioni di ingresso di tutte le pagine partono da qui, non dai
    // singoli componenti: il layout contiene header, pagina e footer, quindi
    // una sola gsap.to(".word-reveal") trova tutte le parole in ordine di
    // documento e lo stagger le fa partire una dopo l'altra anche se stanno
    // in genitori e componenti diversi, e ogni pagina non deve ripetere lo
    // stesso useGSAP per .reveal-shift/.ul.
    // useGSAP gira in un layout effect, che React esegue dopo quelli dei
    // figli: la pagina appena montata è già nel DOM quando qui si cercano gli
    // elementi. pathname fa ripartire tutto a ogni cambio pagina (il layout
    // non si rismonta), e useGSAP annulla prima animazioni e ScrollTrigger
    // della pagina precedente.
    // Gli stati di partenza si impostano subito e restano per tutta la
    // splash, così quando l'animazione parte non c'è nessun salto. Finché la
    // splash è a schermo non parte nulla: gli ScrollTrigger di elementi già
    // nel viewport scatterebbero subito, e l'animazione finirebbe
    // (invisibile) dietro la splash stessa
    useGSAP(() => {
        setElement();
        setWordReveal();

        if (showSplash) return;

        toElement();
        toWordReveal();
    }, { scope: layoutRef, dependencies: [showSplash, pathname] });

    return (
        <div ref={layoutRef} className="bg-zinc-950 text-stone-200 font-zalando font-stretch-[117.5%] relative min-h-svh print:bg-white print:text-black">

            <div ref={cursorRef} className="fixed w-3 h-3 bg-zinc-200 pointer-events-none z-50 max-md:hidden print:hidden"></div>

            <AppHeader />
            <div className="overflow-hidden px-2 sm:px-4">
                <Outlet />
            </div>
            <AppFooter />


        </div>
    )

}