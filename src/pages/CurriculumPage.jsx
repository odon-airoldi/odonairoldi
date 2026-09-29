
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import AppFooter from "../components/AppFooter";
import AppHeader from "../components/AppHeader";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const introText = "Formazione artistica ed esperienza nel graphic design sono all'origine del mio orientamento allo sviluppo web. Ho intrapreso questa direzione nel corso delle mie esperienze professionali, per poi consolidarla attraverso un percorso formativo fullstack. Metodo progettuale e sensibilità visiva accompagnano oggi il mio lavoro da sviluppatore.";

export default function CurriculumPage() {

    const pageRef = useRef(null);

    useGSAP(() => {
        const words = gsap.utils.toArray(".intro-word");
        const items = gsap.utils.toArray(".reveal-shift");
        const lists = gsap.utils.toArray(".ul");

        // la classe -translate-x-full va annullata subito, non solo dentro
        // onComplete: altrimenti le etichette resterebbero visibilmente spostate
        // a sinistra per tutta la durata dell'animazione del testo, prima ancora
        // che i loro ScrollTrigger vengano creati
        gsap.set(items, { x: 0 });
        // stesso discorso per le liste: partono già scostate di 16px a destra
        gsap.set(lists, { x: 16 });

        // le parole compaiono in successione, 6 alla volta: stesso delay per ogni
        // gruppo di 6 parole consecutive, tutte da sotto
        const groupSize = 6;
        const groupDelay = 0.2;

        // le reveal-shift non partono con un delay "a occhio" copiato dalla durata
        // del testo introduttivo (si sarebbe disallineato appena una delle due
        // fosse cambiata): i loro ScrollTrigger vengono creati solo dentro
        // onComplete del testo, quindi scattano davvero subito dopo che è finito,
        // qualunque sia la sua durata
        gsap.from(words, {
            y: "110%",
            duration: 1,
            ease: "power2.inOut",
            stagger: (i) => Math.floor(i / groupSize) * groupDelay,
            onComplete: () => {
                items.forEach((el) => {
                    gsap.to(el, {
                        x: "-100%",
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 90%",
                        },
                    });
                });
                // stessa identica logica delle reveal-shift, ma le liste tornano
                // a x:0 invece di andare a -100% (qui l'obiettivo è solo togliere
                // lo scostamento di 16px impostato sopra)
                lists.forEach((el) => {
                    gsap.to(el, {
                        x: 0,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 90%",
                        },
                    });
                });
            },
        });
    }, { scope: pageRef });

    return (
        <div ref={pageRef}>

            <div className="grid grid-cols-6 pb-16">

                <div className="col-span-1 col-start-2">
                    <h3 className="text-lg/4 uppercase mb-4">Odon</h3>
                </div>
                <div className="col-span-1">
                    <h3 className="text-lg/4 uppercase mb-4">Airoldi</h3>
                </div>
                <div className="col-span-1">
                    <h3 className="text-lg/4 uppercase mb-4">17 12 87</h3>
                </div>
                <div className="col-span-1">
                    <h3 className="text-lg/4 uppercase mb-4">23900</h3>
                </div>
                <div className="col-span-1">
                </div>

            </div>

            <div className="grid grid-cols-6 pb-16">

                <div className="col-span-4 col-start-3">
                    <p className="text-[40px]/[40px] uppercase text-justify text-justify-last">
                        {introText.split(" ").flatMap((word, i) => [
                            <span key={`w-${i}`} className="inline-block overflow-hidden align-bottom">
                                <span className="intro-word inline-block">{word}</span>
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
                            <span className="inline-block -translate-x-full reveal-shift">Boolean</span>
                            <ul className="ul">
                                <li>Web Development</li>
                                <li>Online</li>
                                <li>2026</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block -translate-x-full reveal-shift">Isgmd Design Academy</span>
                            <ul className="ul">
                                <li>Graphic Design</li>
                                <li>Lecco</li>
                                <li>2010 2012</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block -translate-x-full reveal-shift">Accademia di Brera</span>
                            <ul className="ul">
                                <li>Scultura</li>
                                <li>Milano</li>
                                <li>2007 2009</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block -translate-x-full reveal-shift">Liceo Artistico M Rosso</span>
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
                            <span className="inline-block -translate-x-full reveal-shift">Agostani Caffè</span>
                            <ul className="ul">
                                <li>Graphic designer</li>
                                <li>Frontend developer</li>
                                <li>Molteno</li>
                                <li>2022 2025</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block -translate-x-full reveal-shift">Studiolabo</span>
                            <ul className="ul">
                                <li>Frontend developer</li>
                                <li>Milano</li>
                                <li>2020 2022</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block -translate-x-full reveal-shift">Ardesia Studio</span>
                            <ul className="ul">
                                <li>Co Founder</li>
                                <li>Graphic Designer</li>
                                <li>Bergamo</li>
                                <li>2014 2019</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block -translate-x-full reveal-shift">Office Milano</span>
                            <ul className="ul">
                                <li>Graphic Designer</li>
                                <li>Milano</li>
                                <li>2012</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block -translate-x-full reveal-shift">Oikos</span>
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
                            <span className="inline-block -translate-x-full reveal-shift">Frontend</span>
                            <ul className="ul">
                                <li>React</li>
                                <li>JavaScript</li>
                                <li>Tailwind</li>
                                <li>Bootstrap</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block -translate-x-full reveal-shift">Backend</span>
                            <ul className="ul">
                                <li>Node</li>
                                <li>Express</li>
                                <li>Php</li>
                                <li>Laravel</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block -translate-x-full reveal-shift">Database</span>
                            <ul className="ul">
                                <li>Mysql</li>
                                <li>Sqlite</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block -translate-x-full reveal-shift">Cms</span>
                            <ul className="ul">
                                <li>Wordpress</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block -translate-x-full reveal-shift">Design</span>
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
                            <span className="inline-block -translate-x-full reveal-shift">WebSite</span>
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
                            <span className="inline-block -translate-x-full reveal-shift">Graphic</span>
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

        </div>
    );
}

