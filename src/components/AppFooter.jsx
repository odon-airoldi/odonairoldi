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
            <div className="fixed bottom-2 sm:bottom-4 right-2 sm:right-4 print:hidden">
                <div className="text-xs sm:text-sm xl:text-base font-extralight word-spacing-[.5em] leading-none tracking-wide uppercase overflow-hidden">
                    <span className="word-reveal block">LC {dataWeather.name && <span>{Math.round(dataWeather.main?.temp)}°C</span>}</span>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 sm:right-auto p-2 sm:p-4">
                <div className="w-full sm:w-24 lg:w-32">
                    <AppLogo />
                </div>
            </div>
            {/* <div className={`p-2 sm:p-4 sm:fixed sm:bottom-0 sm:left-0 sm:right-auto ${pathname === "/" ? 'fixed bottom-0 left-0 right-0' : ''}`}>
                <div className="w-full sm:w-24 lg:w-32">
                    <AppLogo />
                </div>
            </div> */}
        </footer >
    )
}