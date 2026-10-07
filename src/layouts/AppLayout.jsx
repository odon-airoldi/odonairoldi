import { useRef } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useAppContext } from "../contexts/AppContext"
import { setWordReveal, toWordReveal } from "../utils/gsap"

import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

gsap.registerPlugin(useGSAP);

export default function AppLayout() {

    const { cursorRef, showSplash } = useAppContext();
    const { pathname } = useLocation();
    const layoutRef = useRef(null);

    // le parole .word-reveal si animano tutte da qui, non nei singoli
    // componenti: il layout contiene header, pagina e footer, quindi una sola
    // gsap.to(".word-reveal") le trova tutte in ordine di documento e lo
    // stagger le fa partire una dopo l'altra anche se stanno in genitori e
    // componenti diversi. Con un'animazione per componente ognuna avrebbe il
    // proprio stagger, e partirebbero tutte insieme.
    // useGSAP gira in un layout effect, che React esegue dopo quelli dei
    // figli: la pagina appena montata è già nel DOM quando qui si cercano le
    // parole. pathname fa ripartire tutto a ogni cambio pagina (l'header non
    // si rismonta), showSplash tiene le parole nascoste finché c'è la splash
    useGSAP(() => {
        setWordReveal();

        if (showSplash) return;

        toWordReveal();
    }, { scope: layoutRef, dependencies: [showSplash, pathname] });

    return (
        <div ref={layoutRef} className="bg-zinc-950 text-stone-200 font-zalando font-stretch-[117.5%] relative min-h-svh p-2 sm:p-4 print:bg-white print:text-black">

            <div ref={cursorRef} className="fixed w-3 h-3 bg-zinc-200 pointer-events-none z-50 max-md:hidden print:hidden"></div>

            <AppHeader />
            <Outlet />
            <AppFooter />


        </div>
    )

}