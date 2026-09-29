import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import AppLogo from "./AppLogo"


export default function AppHeader() {

    const location = useLocation()

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

        <header className="">

            <div className="fixed top-4 left-4">
                <AppLogo />
            </div>

            <div className="fixed top-4 right-4">
                {location.pathname === "/" &&
                    <button type="button" onClick={handleCopyEmail} className="text-lg/4 uppercase block ms-auto cursor-pointer">
                        {copied ? "Email copied" : "Email me"}
                    </button>
                }
                {location.pathname === "/cv" &&
                    <button type="button" className="text-lg/4 uppercase block ms-auto cursor-pointer">
                        Get CV
                    </button>
                }
            </div>

        </header>
    )
}