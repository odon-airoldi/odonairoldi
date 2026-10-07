import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import AppLogo from "./AppLogo"

export default function AppFooter() {

    const { pathname } = useLocation();

    return (

        <footer>
            <div className={`p-2 sm:p-4 sm:fixed sm:bottom-0 sm:left-auto sm:right-0 ${pathname === "/" ? 'fixed bottom-0 left-0 right-0' : ''}`}>
                <div className="w-full sm:w-24 xl:w-32">
                    <AppLogo />
                </div>
            </div>
        </footer >
    )
}