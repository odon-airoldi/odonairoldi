import { useRef } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useAppContext } from "../contexts/AppContext"
import { setReveal, toReveal } from "../utils/gsap"

import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

gsap.registerPlugin(useGSAP);

export default function AppLayout() {

    const { cursorRef, showSplash } = useAppContext();
    const { pathname } = useLocation();
    const layoutRef = useRef(null);

    // le animazioni di ingresso di tutte le pagine partono da qui, non dai
    // singoli componenti: il layout contiene header, pagina e footer, quindi
    // toReveal trova tutti i genitori .alive in ordine di documento e li fa
    // partire uno dopo l'altro anche se stanno in componenti diversi, e ogni
    // pagina non deve ripetere lo stesso useGSAP.
    // useGSAP gira in un layout effect, che React esegue dopo quelli dei
    // figli: la pagina appena montata è già nel DOM quando qui si cercano gli
    // elementi. pathname fa ripartire tutto a ogni cambio pagina (il layout
    // non si rismonta), e useGSAP annulla prima le animazioni della pagina
    // precedente.
    // Gli stati di partenza si impostano subito e restano per tutta la
    // splash, così quando l'animazione parte non c'è nessun salto. Finché la
    // splash è a schermo non parte nulla: gli elementi già nel viewport
    // partirebbero subito, e l'animazione finirebbe (invisibile) dietro la
    // splash stessa
    useGSAP(() => {
        setReveal();

        if (showSplash) return;

        // toReveal ritorna la funzione che scollega il suo IntersectionObserver:
        // ritornata qui, useGSAP la chiama al cambio pagina insieme al revert
        return toReveal();
    }, { scope: layoutRef, dependencies: [showSplash, pathname] });

    return (
        <div ref={layoutRef} className="bg-zinc-950 text-zinc-200 font-zalando font-stretch-[117.5%] relative min-h-svh">

            <div ref={cursorRef} className="fixed w-3 h-3 bg-zinc-200 pointer-events-none z-50 max-md:hidden print:hidden"></div>

            <AppHeader />
            <div className="overflow-hidden px-2 sm:px-4">
                <Outlet />
            </div>
            <AppFooter />


        </div>
    )

}