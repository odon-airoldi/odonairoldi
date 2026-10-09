
import { useState } from "react";
import { Link } from "react-router-dom";
import { stack, formazione, esperienza, work } from "../data/data"
import AppList from "../components/AppList";

const introText = "Formazione artistica ed esperienza nel graphic design sono all'origine del mio orientamento allo sviluppo web. Ho intrapreso questa direzione nel corso delle mie esperienze professionali, per poi consolidarla attraverso un percorso formativo fullstack. Metodo progettuale e sensibilità visiva accompagnano oggi il mio lavoro da sviluppatore.";

export default function CurriculumPage() {

    // apre il pdf in una nuova scheda: essendo un pdf (non html), il
    // browser lo mostra nel proprio lettore pdf nativo invece di
    // navigarci sopra — niente dialogo di stampa, il file va rigenerato ed
    // esportato a mano in public/cv.pdf quando il cv cambia
    const handleGetCv = () => {
        window.open("/cv.pdf", "_blank");
    };

    const [copied, setCopied] = useState(false)

    // mostra "Email copied" solo se la copia negli appunti riesce davvero (try), non a
    // prescindere dal click: se il browser nega il permesso (catch) il testo resta
    // invariato invece di dare un falso esito positivo. Torna a "Email me" dopo 2s
    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText('odon.airoldi@gmail.com')
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch { }
    }

    return (
        <div className="py-[8vw] print:relative print:min-h-[calc(29.7cm-32px)]">

            <div className="hidden print:block">
                <div className="grid grid-cols-10">
                    <div className="col-span-10 border-b mb-2 uppercase text-xs flex justify-between">
                        <div>17 12 1987</div>
                        <div>+39 3409900243</div>
                        <div>odon.airoldi@gmail.com</div>
                        <div>Lecco</div>
                    </div>
                    <div className="col-span-10 border-b mb-2 uppercase text-xs flex justify-between">
                        <div><Link to="https://www.linkedin.com/in/odon-airoldi/">linkedin.com/in/odon-airoldi</Link></div>
                        <div><Link to="https://github.com/odon-airoldi">github.com/odon-airoldi</Link></div>
                        <div><Link to="https://www.odon-airoldi.com">odon-airoldi.com</Link></div>
                    </div>
                    <div className="col-span-10 border-b mb-2 uppercase text-xs flex justify-between">
                        <div>From</div>
                        <div>graphic</div>
                        <div>designer</div>
                        <div>to</div>
                        <div>fullstack</div>
                        <div>developer</div>
                    </div>
                    <div className="col-span-4">
                        <img className="w-full pe-4" src="https://placehold.co/400x400" />
                    </div>
                    <div className="col-span-6">
                        <h1 className="text-[40px] font-medium uppercase text-justify text-justify-last tracking-tighter">Odon Airoldi</h1>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-x-2 xl:gap-x-4 gap-y-[8vw] print:grid-cols-10 print:-translate-y-1/2">

                <div className="col-span-12 print:col-span-6 print:col-start-5">
                    <p data-stagger="0.02" className="alive text-base sm:text-[3.125vw] font-extralight flex flex-wrap justify-between gap-y-[.125em] gap-x-[.75em] uppercase leading-[.75em] tracking-wide sm:tracking-tighter print:text-[20px]/[20px] print:normal-case">
                        {introText.split(" ").flatMap((word, i) => [
                            <span key={`w-${i}`} className="overflow-hidden p-[.075em] print:overflow-visible">
                                <span className="word-reveal block">{word}</span>
                            </span>,
                            " ",
                        ])}
                    </p>
                </div>

                <div className="col-span-6 md:col-span-4 print:hidden">
                    <div className="alive text-xs sm:text-sm xl:text-base font-extralight word-spacing-[.5em] leading-none tracking-wide uppercase overflow-hidden print:text-right print:text-6xl print:font-medium">
                        <div className="word-reveal border-t border-zinc-200 pt-2">Odon Airoldi</div>
                    </div>
                </div>
                <div className="col-span-3 md:col-span-2 print:hidden">
                    <div className="alive text-xs sm:text-sm xl:text-base font-extralight word-spacing-[.5em] leading-none tracking-wide uppercase overflow-hidden print:text-right">
                        <div className="word-reveal border-t border-zinc-200 pt-2">23900</div>
                    </div>
                </div>
                <div className="col-span-3 md:col-span-2 print:hidden">
                    <div className="alive text-xs sm:text-sm xl:text-base font-extralight word-spacing-[.5em] leading-none tracking-wide uppercase overflow-hidden">
                        <div className="word-reveal border-t border-zinc-200 pt-2">17 12 87</div>
                    </div>
                </div>
                <div className="col-span-6 md:col-span-2">
                    <button className="alive text-xs sm:text-sm xl:text-base font-extralight word-spacing-[.5em] leading-none tracking-wide uppercase overflow-hidden cursor-pointer block w-full text-left" to="/cv">
                        <div className="word-reveal border-t border-zinc-200 pt-2">Get C V</div>
                    </button>
                </div>
                <div className="col-span-6 md:col-span-2 print:hidden">
                    <button className="alive text-xs sm:text-sm xl:text-base font-extralight word-spacing-[.5em] leading-none tracking-wide uppercase overflow-hidden cursor-pointer block w-full text-left" type="button" onClick={handleCopyEmail}>
                        <div className="word-reveal border-t border-zinc-200 pt-2">{copied ? "Email copied" : "Email me"}</div>
                    </button>
                </div>

                <div className="col-span-6 col-start-7 md:col-span-4 md:col-start-5 print:col-span-3 print:col-start-3">
                    <div className="alive overflow-hidden">
                        <div className="word-reveal border-t border-zinc-200 pt-2 text-xs sm:text-sm xl:text-base font-extralight leading-none tracking-wide uppercase mb-4 print:text-sm print:normal-case">Formazione</div>
                    </div>
                    <AppList list={formazione} />
                </div>
                <div className="col-span-6 col-start-7 md:col-span-4 print:col-span-3">
                    <div className="alive overflow-hidden">
                        <div className="word-reveal border-t border-zinc-200 pt-2 text-xs sm:text-sm xl:text-base font-extralight leading-none tracking-wide uppercase mb-4 print:text-sm print:normal-case">Esperienza</div>
                    </div>
                    <AppList list={esperienza} />
                </div>
                <div className="col-span-6 col-start-7 md:col-span-4 md:col-start-5 print:col-start-9">
                    <div className="alive overflow-hidden">
                        <div className="word-reveal border-t border-zinc-200 pt-2 text-xs sm:text-sm xl:text-base font-extralight leading-none tracking-wide uppercase mb-4 print:text-sm print:normal-case">Stack</div>
                    </div>
                    <AppList list={stack} />
                </div>
                <div className="col-span-6 col-start-7 md:col-span-4 print:hidden">
                    <div className="alive overflow-hidden">
                        <div className="word-reveal border-t border-zinc-200 pt-2 text-xs sm:text-sm xl:text-base font-extralight leading-none tracking-wide uppercase mb-4">Work</div>
                    </div>
                    <AppList list={work} />
                </div>

            </div>

            <div className="hidden print:block print:absolute print:bottom-0 print:inset-x-0">
                <div className="font-medium text-[40px] text-justify text-justify-last tracking-tighter uppercase">
                    Portfolio on <Link to="https://www.odon-airoldi.com">odon-airoldi.com</Link>
                </div>
            </div>

        </div >
    );
}

