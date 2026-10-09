import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import AppLogo from "./AppLogo"

export default function AppFooter() {

    const { pathname } = useLocation();

    // API key openweathermap
    const apiKey = import.meta.env.VITE_API_KEY_OWM
    const [dataWeather, setDataWeather] = useState({})
    // Chiamata AJAX tramite fetch API openweathermap: nel footer, che sta nel
    // layout e non si rismonta, parte una volta sola invece che a ogni pagina
    useEffect(() => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=Lecco&appid=${apiKey}&units=metric`)
            .then(res => res.json())
            .then(data => {
                setDataWeather(data)
            })
    }, [apiKey])

    return (

        <footer>
            <div className="p-2 sm:p-4 fixed bottom-0 right-0 max-sm:hidden print:hidden">
                <div className="alive text-xs sm:text-sm xl:text-base font-extralight word-spacing-[.5em] leading-none tracking-wide uppercase overflow-hidden">
                    <span className="word-reveal block">LC {dataWeather.name && <span>{Math.round(dataWeather.main?.temp)}°C</span>}</span>
                </div>
            </div>
            <div className={`p-2 sm:p-4 fixed bottom-0 left-0 sm:w-32 lg:w-48 ${pathname === "/" ? 'w-full' : 'w-24'}`}>
                <div className={`w-full`}>
                    <AppLogo />
                </div>
            </div>
        </footer >
    )
}