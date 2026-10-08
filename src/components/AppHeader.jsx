import { Link, useLocation } from "react-router-dom"
import AppLogo from "./AppLogo";

export default function AppHeader() {

    const { pathname } = useLocation();

    // le parole .word-reveal sono animate da AppLayout, insieme a quelle
    // della pagina, così partono tutte in un'unica successione
    return (

        <header className="sticky top-0 pt-2 sm:pt-4 px-2 sm:px-4 bg-zinc-950 z-1">
            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <Link to="/" className="text-[6vw] sm:text-[7.5vw] leading-none sm:leading-[.8] font-extralight sm:font-[450] tracking-tighter uppercase">
                        <h1 className="flex justify-between overflow-hidden">
                            <span className="word-reveal">Odon</span>
                            <span className="word-reveal">Airoldi</span></h1>
                        {pathname === "/" &&
                            <>
                                <h2 className="flex justify-between overflow-hidden"><span className="word-reveal">fullstack</span> <span className="word-reveal">developer</span></h2>
                                <h3 className="flex justify-between overflow-hidden gap-x-[.25em]"><span className="word-reveal">from</span> <span className="word-reveal">graphic</span> <span className="word-reveal ms-auto">design</span></h3>
                            </>
                        }

                    </Link>
                </div>
            </div>
        </header>
    )
}