import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import AppLogo from "./AppLogo"


export default function AppHeader() {

    const location = useLocation()


    return (

        <header className="">

            <div className="fixed top-4 left-4">
                <AppLogo />
            </div>

        </header>
    )
}