import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import AppLogo from "./AppLogo"

export default function AppFooter() {

    const { pathname } = useLocation();

    return (

        <footer>
            <div className={`sm:fixed sm:bottom-4 sm:left-auto sm:right-4 ${pathname === "/" ? 'fixed bottom-2 left-2 right-2' : ''}`}>
                <div className="w-full sm:w-24 xl:w-32">
                    <AppLogo />
                </div>
            </div>
        </footer >
    )
}