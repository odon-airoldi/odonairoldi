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

        <div ref={pageRef} className="sm:pt-4">

            <div className="grid grid-cols-12 sm:gap-y-4">
                <div className="col-span-12 sm:col-span-4 md:col-span-4 lg:col-span-3 max-sm:hidden">
                    <h3 className="font-extralight leading-none tracking-wide uppercase overflow-hidden">
                        <span className="word-reveal block">Odon Airoldi</span>
                    </h3>
                </div>
                <div className="sm:col-span-3 lg:col-span-2 max-sm:hidden">
                    <h3 className="font-extralight leading-none tracking-wide uppercase mb-4 overflow-hidden">
                        <span className="word-reveal block">Stack</span>
                    </h3>
                    <AppList list={stack} />
                </div>
                <div className="sm:col-span-3 lg:col-span-2 max-sm:hidden">
                    <h3 className="font-extralight leading-none tracking-wide uppercase mb-4 overflow-hidden">
                        <span className="word-reveal block">Work</span>
                    </h3>
                    <AppList list={work} />
                </div>
                <div className="col-span-12 sm:col-span-2">
                    <h3 className="font-extralight leading-none tracking-wide uppercase">
                        <Link className="overflow-hidden max-sm:flex max-sm:justify-between max-sm:text-[6vw]" to="/cv">
                            <span className="sm:hidden word-reveal">MY</span> <span className="word-reveal">CV</span>
                        </Link>
                    </h3>
                </div>
                <div className="lg:col-span-2 max-lg:hidden">
                    <button className="font-extralight leading-none tracking-wide uppercase cursor-pointer block" type="button" onClick={handleCopyEmail}>
                        <span className="word-reveal block">{copied ? "Email copied" : "Email me"}</span>
                    </button>
                </div>
                <div className="lg:col-span-1 max-lg:hidden">
                    <h3 className="font-extralight leading-none tracking-wide uppercase">
                        <span className="word-reveal block">LC {dataWeather.name && <span>{Math.round(dataWeather.main?.temp)}°C</span>}</span>
                    </h3>
                </div>
            </div>
        </div >
    )
}