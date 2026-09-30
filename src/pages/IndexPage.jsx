import { Link } from "react-router-dom"
import { createPortal } from "react-dom"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef, useState } from "react"
import { useAppContext } from "../contexts/AppContext"
import { setElement, toElement, createInfiniteGallery } from "../utils/gsap"
import { websites, designs } from "../data/data"


gsap.registerPlugin(useGSAP)


export default function IndexPage() {
    // deve avvolgere tutta la pagina, non solo il testo hero: startRevealShift
    // cerca .reveal-shift/.ul con un selettore testuale, e lo scope di useGSAP
    // limita quella ricerca ai soli discendenti del nodo — le liste Stack/Work
    // sono fuori dal blocco del testo hero, altrimenti resterebbero irraggiungibili
    const pageRef = useRef(null);
    const { showSplash } = useAppContext();

    useGSAP(() => {

        // nasconde subito Stack/Work nella loro posizione di partenza — vedi
        // hideRevealShift — per tutta la durata della splash, così quando
        // l'animazione parte non c'è nessun salto verso quella posizione
        setElement();

        // nasconde subito le parole della hero — vedi hideTextReveal — per
        // tutta la durata della splash, incluso il suo fade-out, altrimenti
        // si vedrebbero già ferme in posizione prima che l'animazione sia
        // partita davvero

        // finché la splash è a schermo non c'è motivo di far partire nulla:
        // Stack e Work sono già dentro il viewport iniziale (non serve scroll
        // per vederle), quindi lo scrollTrigger di startRevealShift
        // scatterebbe subito se creato ora, e l'animazione finirebbe
        // (invisibile) dietro la splash stessa. Quando showSplash passa a
        // false l'effetto riparte (dependencies) ed è quello il momento
        // giusto per creare lo scrollTrigger e far partire il testo
        if (showSplash) return;

        toElement();
    }, { scope: pageRef, dependencies: [showSplash] });



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

    const [openIndex, setOpenIndex] = useState(null)

    // gallery infinita e trascinabile (vedi createInfiniteGallery in
    // utils/gsap): itemsEl/dragProxyEl vivono dentro il portal, montati solo
    // per il design aperto. useGSAP dipende da openIndex, quindi ad ogni
    // apertura/chiusura/cambio design la gallery precedente viene ripulita
    // (kill di Draggable e delle timeline, via la funzione di cleanup
    // ritornata) e se ne crea una nuova, già al primo elemento
    const itemsRef = useRef(null);
    const dragProxyRef = useRef(null);

    useGSAP(() => {
        if (!itemsRef.current) return;
        return createInfiniteGallery(itemsRef.current, dragProxyRef.current);
    }, { dependencies: [openIndex] });

    return (

        <div ref={pageRef}>

            <div className="grid grid-cols-6">

                <div className="col-span-1 col-start-2">
                    <h3 className="text-lg/4 uppercase h3"><Link to="/" >OA</Link></h3>
                </div>
                <div className="col-span-1">
                    <h3 className="text-lg/4 uppercase h3"><Link to="/cv">CV</Link></h3>
                </div>
                <div className="col-span-1">
                    <h3 className="text-lg/4 uppercase mb-4 h3">Stack</h3>
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
                    </ul>
                </div>
                <div className="col-span-1">
                    <h3 className="text-lg/4 uppercase mb-4 h3">Work</h3>
                    <ul className="text-sm tracking-[.1em]">
                        <li className="mb-4 font-extralight">
                            <span className="inline-block reveal-shift">Websites</span>
                            <ul className="ul">
                                {
                                    websites.map((website) => (
                                        <li key={website.id}>
                                            <button onClick={() => setOpenIndex(openIndex === website.id ? null : website.id)}>{website.title}</button>
                                            {openIndex === website.id &&
                                                <div className="ms-8 mb-4">
                                                    {website.description}
                                                </div>
                                            }
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block reveal-shift">Designs</span>
                            <ul className="ul">
                                {
                                    designs.map((design) => (
                                        <li key={design.id}>
                                            <button onClick={() => setOpenIndex(openIndex === design.id ? null : design.id)}>{design.title}</button>
                                            {openIndex === design.id && createPortal
                                                (<div className="fixed z-50 inset-0 flex items-center justify-center">
                                                    <div className="absolute inset-0 z-51" onClick={() => setOpenIndex(null)}></div>
                                                    <ul className="grid place-items-center z-52" ref={itemsRef}>
                                                        {design.gallery.map((img) => (
                                                            <li key={img} className="col-start-1 row-start-1 px-1">
                                                                <img src={img} draggable={false} className="pointer-events-none" />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="drag-proxy hidden" ref={dragProxyRef}></div>
                                                </div>, document.body)
                                            }
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className="col-span-1">
                    <div className="fixed top-4 right-4">
                        <button type="button" onClick={handleCopyEmail} className="text-lg/4 uppercase block ms-auto cursor-pointer">
                            {copied ? "Email copied" : "Email me"}
                        </button>
                    </div>
                </div>
            </div >

            <div className="absolute bottom-10 inset-x-4 overflow-hidden">
                <div className="text-8xl uppercase font-medium leading-20 tracking-tighter">
                    <h1 className="overflow-hidden flex justify-between"><span className="reveal-text">Odon</span> <span className="reveal-text">Airoldi</span></h1>
                    <h2 className="overflow-hidden flex justify-between"><span className="reveal-text">fullstack</span> <span className="reveal-text">developer</span></h2>
                    <h3 className="overflow-hidden flex justify-between"><span className="reveal-text">from graphic</span> <span className="reveal-text">design</span></h3>
                </div>
            </div>

        </div >
    )
}