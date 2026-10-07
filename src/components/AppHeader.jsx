import { useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useAppContext } from "../contexts/AppContext"
import { setRevealText, toRevealText } from "../utils/gsap"


gsap.registerPlugin(useGSAP)


export default function AppHeader() {

    // scope del testo hero: .reveal-text è cercata con un selettore testuale,
    // e senza scope prenderebbe anche le parole .reveal-text della pagina
    // (es. CurriculumPage), che hanno già la loro animazione
    const headerRef = useRef(null);
    const { showSplash } = useAppContext();
    const { pathname } = useLocation();

    // stesso schema delle pagine: parole nascoste subito, per tutta la durata
    // della splash, e animate solo quando showSplash passa a false. L'header
    // sta nel layout e non si rismonta cambiando pagina: pathname nelle
    // dependencies fa ripartire l'effetto a ogni cambio di rotta, e useGSAP
    // annulla prima l'animazione precedente, così le parole ripartono da
    // nascoste anche se si cambia pagina a metà animazione
    useGSAP(() => {
        setRevealText();

        if (showSplash) return;

        toRevealText();
    }, { scope: headerRef, dependencies: [showSplash, pathname] });

    return (

        <header ref={headerRef} className="mb-2">
            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <div className="text-[6vw] sm:text-[7.5vw] sm:leading-[.8] font-extralight sm:font-[450] tracking-tighter uppercase">
                        <span className="flex justify-between overflow-hidden"><span className="reveal-text">Odon</span> <span className="reveal-text">Airoldi</span></span>
                        {pathname === "/" &&
                            <>
                                <span className="flex justify-between overflow-hidden"><span className="reveal-text">fullstack</span> <span className="reveal-text">developer</span></span>
                                <span className="flex justify-between overflow-hidden gap-x-[.25em]"><span className="reveal-text">from</span> <span className="reveal-text">graphic</span> <span className="reveal-text ms-auto">design</span></span>
                                <Link className="flex justify-between overflow-hidden sm:hidden" to="/cv"><span className="reveal-text">My</span><span className="reveal-text">CV</span></Link>
                            </>
                        }

                    </div>
                </div>
            </div>
        </header>
    )
}