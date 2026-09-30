// importa le due funzioni di React per creare e leggere un context
import { createContext, useContext, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import AppIntro from "../components/AppIntro";

gsap.registerPlugin(useGSAP);

// crea il context
const AppContext = createContext();

// componente Provider, riceve children (i componenti che avvolgerà)
function AppProvider({ children }) {

    // la splash vive qui (non più in App.jsx) perché la sua durata determina il
    // delay del fade qui sotto: tenerle insieme evita di passare skipIntroDelay
    // come prop attraverso App.jsx
    const [showSplash, setShowSplash] = useState(true);

    const cursorRef = useRef(null);

    // cursore custom globale: essendo nel Provider (che avvolge tutte le pagine
    // in App.jsx), funziona ovunque senza doverlo ripetere in ogni pagina
    useGSAP(() => {

        const handleMove = (e) => {
            gsap.set(cursorRef.current, { x: e.clientX - 12, y: e.clientY - 12 });
        };

        window.addEventListener("mousemove", handleMove);

    });




    return (
        // .Provider è il componente che distribuisce il value ai discendenti
        <AppContext.Provider
            value={{
                // qui vanno i dati/funzioni condivisi
                cursorRef,
                // esposto così le pagine possono far partire le proprie
                // animazioni solo quando la splash è finita
                showSplash
            }}
        >
            {showSplash && <AppIntro onDone={() => setShowSplash(false)} />}
            {
                // renderizza i componenti figli passati ad AppProvider
                children
            }
        </AppContext.Provider>
    )

}

// hook custom per leggere il context
function useAppContext() {
    // legge il value del Provider più vicino nell'albero
    const context = useContext(AppContext)
    return context // restituisce quel value
}

// esporta Provider e hook
export { AppProvider, useAppContext }