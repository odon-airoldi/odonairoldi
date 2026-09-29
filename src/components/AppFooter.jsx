import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export default function AppFooter() {

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

    console.log(dataWeather)

    return (

        <footer className="fixed bottom-4 right-4">
            <div className="text-lg/4 uppercase">
                Lecco {dataWeather.name && <span>{Math.round(dataWeather.main?.temp)}°C</span>}
            </div>
        </footer >
    )
}