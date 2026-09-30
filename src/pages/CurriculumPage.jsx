
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useAppContext } from "../contexts/AppContext";
import { setElement, toElement } from "../utils/gsap"


gsap.registerPlugin(useGSAP);

const introText = "Formazione artistica ed esperienza nel graphic design sono all'origine del mio orientamento allo sviluppo web. Ho intrapreso questa direzione nel corso delle mie esperienze professionali, per poi consolidarla attraverso un percorso formativo fullstack. Metodo progettuale e sensibilità visiva accompagnano oggi il mio lavoro da sviluppatore.";

export default function CurriculumPage() {

    const pageRef = useRef(null);
    const { showSplash } = useAppContext();

    useGSAP(() => {
        // nasconde subito Formazione/Esperienza/Stack/Work nella loro
        // posizione di partenza — vedi hideRevealShift — per tutta la durata
        // della splash, così quando l'animazione parte non c'è nessun salto
        // verso quella posizione
        setElement();


        // finché la splash è a schermo non c'è motivo di far partire nulla:
        // se un reveal-shift si trovasse già dentro il viewport iniziale, lo
        // scrollTrigger di startRevealShift scatterebbe subito se creato ora,
        // e l'animazione finirebbe (invisibile) dietro la splash stessa.
        // Quando showSplash passa a false l'effetto riparte (dependencies) ed
        // è quello il momento giusto per creare lo scrollTrigger e far
        // partire il testo
        if (showSplash) return;

        toElement();
    }, { scope: pageRef, dependencies: [showSplash] });

    return (
        <div ref={pageRef}>

            <div className="grid grid-cols-6 pb-16">

                <div className="col-span-1 col-start-2">
                    <h3 className="text-lg/4 uppercase mb-4 h3">Odon</h3>
                </div>
                <div className="col-span-1">
                    <h3 className="text-lg/4 uppercase mb-4 h3">Airoldi</h3>
                </div>
                <div className="col-span-1">
                    <h3 className="text-lg/4 uppercase mb-4 h3">17 12 87</h3>
                </div>
                <div className="col-span-1">
                    <h3 className="text-lg/4 uppercase mb-4 h3">23900</h3>
                </div>
                <div className="col-span-1">
                    <button type="button" className="text-lg/4 uppercase block ms-auto cursor-pointer">
                        Get CV
                    </button>
                </div>

            </div>

            <div className="grid grid-cols-6 pb-16">

                <div className="col-span-4 col-start-3">
                    <p className="text-[40px]/[40px] uppercase text-justify text-justify-last">
                        {introText.split(" ").flatMap((word, i) => [
                            <span key={`w-${i}`} className="inline-block overflow-hidden align-bottom">
                                <span className="reveal-text inline-block">{word}</span>
                            </span>,
                            " ",
                        ])}

                    </p>
                </div>
            </div>

            <div className="grid grid-cols-6">

                <div className="col-span-2 col-start-3">
                    <h3 className="text-lg/4 uppercase mb-4">Formazione</h3>
                    <ul className="text-sm tracking-[.1em]">
                        <li className="mb-4 font-extralight">
                            <span className="inline-block reveal-shift">Boolean</span>
                            <ul className="ul">
                                <li>Web Development</li>
                                <li>Online</li>
                                <li>2026</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block reveal-shift">Isgmd Design Academy</span>
                            <ul className="ul">
                                <li>Graphic Design</li>
                                <li>Lecco</li>
                                <li>2010 2012</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block reveal-shift">Accademia di Brera</span>
                            <ul className="ul">
                                <li>Scultura</li>
                                <li>Milano</li>
                                <li>2007 2009</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block reveal-shift">Liceo Artistico M Rosso</span>
                            <ul className="ul">
                                <li>Architettura</li>
                                <li>Lecco</li>
                                <li>2002 2006</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className="col-span-2">
                    <h3 className="text-lg/4 uppercase mb-4">Esperienza</h3>
                    <ul className="text-sm tracking-[.1em]">
                        <li className="mb-4 font-extralight">
                            <span className="inline-block reveal-shift">Agostani Caffè</span>
                            <ul className="ul">
                                <li>Graphic designer</li>
                                <li>Frontend developer</li>
                                <li>Molteno</li>
                                <li>2022 2025</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block reveal-shift">Studiolabo</span>
                            <ul className="ul">
                                <li>Frontend developer</li>
                                <li>Milano</li>
                                <li>2020 2022</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block reveal-shift">Ardesia Studio</span>
                            <ul className="ul">
                                <li>Co Founder</li>
                                <li>Graphic Designer</li>
                                <li>Bergamo</li>
                                <li>2014 2019</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block reveal-shift">Office Milano</span>
                            <ul className="ul">
                                <li>Graphic Designer</li>
                                <li>Milano</li>
                                <li>2012</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block reveal-shift">Oikos</span>
                            <ul className="ul">
                                <li>Graphic Designer</li>
                                <li>Monza</li>
                                <li>2011</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className="col-span-1">
                </div>
                <div className="col-span-1 col-start-2">
                    <h3 className="text-lg/4 uppercase mb-4">Stack</h3>
                    <ul className="text-sm tracking-[.1em]">
                        <li className="mb-4 font-extralight">
                            <span className="inline-block reveal-shift">Frontend</span>
                            <ul className="ul">
                                <li>React</li>
                                <li>JavaScript</li>
                                <li>Tailwind</li>
                                <li>Bootstrap</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block reveal-shift">Backend</span>
                            <ul className="ul">
                                <li>Node</li>
                                <li>Express</li>
                                <li>Php</li>
                                <li>Laravel</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block reveal-shift">Database</span>
                            <ul className="ul">
                                <li>Mysql</li>
                                <li>Sqlite</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block reveal-shift">Cms</span>
                            <ul className="ul">
                                <li>Wordpress</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block reveal-shift">Design</span>
                            <ul className="ul">
                                <li>Illustrator</li>
                                <li>Indesign</li>
                                <li>Photoshop</li>
                                <li>Branding</li>
                                <li>Packaging</li>
                                <li>Web design</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className="col-span-1">
                    <h3 className="text-lg/4 uppercase mb-4">Work</h3>
                    <ul className="text-sm tracking-[.1em]">
                        <li className="mb-6 font-extralight">
                            <span className="inline-block reveal-shift">WebSite</span>
                            <ul className="ul">
                                <li>run-club.dev</li>
                                <li><a href="https://www.tuttocialde.it">tuttocialde.it</a></li>
                                <li><a href="https://www.caffeagostani.com">caffeagostani.com</a></li>
                                <li><a href="https://geomont.com">geomont.com</a></li>
                                <li><a href="https://essense-magazine.com">essense-magazine.com</a></li>
                                <li><a href="https://www.studiofotograficolops.it">studiofotograficolops.it</a></li>
                            </ul>
                        </li>
                        <li className="mb-6 font-extralight">
                            <span className="inline-block reveal-shift">Graphic</span>
                            <ul className="ul">
                                <li>Tenuta Casa Virginia</li>
                                <li>Le Corne</li>
                                <li>Nove Lune</li>
                                <li>Bergamo Sposi</li>
                            </ul>
                        </li>
                    </ul>
                </div>

            </div>

            <div className="h-12 w-21 relative">
                <div className="bg-zinc-200 h-3 w-3 absolute left-3 top-0"></div>
                <div className="bg-zinc-200 h-12 w-3 absolute left-0 top-0"></div>
                <div className="bg-zinc-200 h-12 w-3 absolute left-6 top-0"></div>
                <div className="bg-zinc-200 h-3 w-3 absolute left-3 top-9"></div>


                <div className="bg-zinc-200 h-3 w-3 absolute left-15 top-0"></div>
                <div className="bg-zinc-200 h-3 w-3 absolute left-15 top-6"></div>
                <div className="bg-zinc-200 h-12 w-3 absolute left-12 top-0"></div>
                <div className="bg-zinc-200 h-12 w-3 absolute left-18 top-0"></div>
            </div>

        </div>
    );
}

