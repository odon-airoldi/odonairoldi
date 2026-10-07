import { Link } from "react-router-dom"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef, useState, useEffect } from "react"
import { useAppContext } from "../contexts/AppContext"
import { setElement, toElement } from "../utils/gsap"
import { stack, work } from "../data/data"
import AppList from "../components/AppList"


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

    // API key openweathermap
    const apiKey = import.meta.env.VITE_API_KEY_OWM
    const [dataWeather, setDataWeather] = useState({})
    // Chiamata AJAX tramite fetch API openweathermap
    useEffect(() => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=Lecco&appid=${apiKey}&units=metric`)
            .then(res => res.json())
            .then(data => {
                setDataWeather(data)
            })
    }, [apiKey])

    return (

        <div ref={pageRef}>

            <div className="grid grid-cols-12 sm:gap-y-4">
                <div className="col-span-12 max-sm:hidden-">
                    <div className="text-[6vw] sm:text-[7.5vw] sm:leading-[.8] font-extralight sm:font-[450] tracking-tighter uppercase">
                        <span className="flex justify-between"><span className="reveal-text">Odon</span> <span className="reveal-text">Airoldi</span></span>
                        <span className="flex justify-between"><span className="reveal-text" >fullstack</span> <span className="reveal-text">developer</span></span>
                        <span className="flex justify-between"><span><span className="reveal-text">from</span> <span className="reveal-text">graphic</span></span> <span className="reveal-text">design</span></span>
                        <Link className="flex justify-between sm:hidden" to="/cv"><span className="reveal-text">My</span><span className="reveal-text">CV</span></Link>
                    </div>
                </div>
                <div className="col-span-12 sm:col-span-4 md:col-span-4 lg:col-span-3 max-sm:hidden">
                    <h1 className="font-extralight tracking-wide uppercase"><Link className="block" to="/">Odon Airoldi</Link></h1>
                </div>
                <div className="sm:col-span-3 lg:col-span-2 max-sm:hidden">
                    <h3 className="font-extralight tracking-wide uppercase mb-4">Stack</h3>
                    <AppList list={stack} />
                </div>
                <div className="sm:col-span-3 lg:col-span-2 max-sm:hidden">
                    <h3 className="font-extralight tracking-wide uppercase mb-4">Work</h3>
                    <AppList list={work} />
                </div>
                <div className="col-span-12 sm:col-span-2">
                    <h3 className="font-extralight tracking-wide uppercase max-sm:hidden"><Link className="" to="/cv">CV</Link></h3>
                </div>
                <div className="lg:col-span-2 max-lg:hidden">
                    <button className="font-extralight tracking-wide uppercase cursor-pointer block" type="button" onClick={handleCopyEmail}>
                        {copied ? "Email copied" : "Email me"}
                    </button>
                </div>
                <div className="lg:col-span-1 max-lg:hidden">
                    <h3 className="font-extralight tracking-wide uppercase">LC {dataWeather.name && <span>{Math.round(dataWeather.main?.temp)}°C</span>}</h3>
                </div>
            </div>
        </div >
    )
}