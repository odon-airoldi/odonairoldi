import { Outlet } from "react-router-dom"
import { useAppContext } from "../contexts/AppContext"

import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

export default function AppLayout() {

    const { fadeRef, cursorRef } = useAppContext();

    return (
        <div className="bg-zinc-950 text-stone-200 font-zalando-semiexpanded relative">
            <div ref={fadeRef}>
                <div ref={cursorRef} className="fixed w-3 h-3 bg-zinc-200 pointer-events-none z-50"></div>
                <AppHeader />
                <Outlet />
                <AppFooter />
            </div>
        </div>
    )

}