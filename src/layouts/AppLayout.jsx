import { Outlet } from "react-router-dom"
import { useAppContext } from "../contexts/AppContext"

import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

export default function AppLayout() {

    const { cursorRef } = useAppContext();

    return (
        <div className="bg-zinc-950 text-stone-200 font-zalando font-stretch-[117.5%] leading-none relative min-h-svh p-4 print:bg-white print:text-black">

            <div ref={cursorRef} className="fixed w-3 h-3 bg-zinc-200 pointer-events-none z-50 md:hidden print:hidden"></div>

            <AppHeader />
            <Outlet />
            <AppFooter />


        </div>
    )

}