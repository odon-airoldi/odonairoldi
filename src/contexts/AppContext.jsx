// importa le due funzioni di React per creare e leggere un context
import { createContext, useContext, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// crea il context
const AppContext = createContext();

// componente Provider, riceve children (i componenti che avvolgerà)
function AppProvider({ children, skipIntroDelay = false }) {

    const cursorRef = useRef(null);
    const fadeRef = useRef(null);

    // cursore custom globale: essendo nel Provider (che avvolge tutte le pagine
    // in App.jsx), funziona ovunque senza doverlo ripetere in ogni pagina
    useGSAP(() => {

        const handleMove = (e) => {
            gsap.set(cursorRef.current, { x: e.clientX - 12, y: e.clientY - 12 });
        };

        window.addEventListener("mousemove", handleMove);

    });



    useGSAP(() => {
        // fade in della pagina, temporizzato per iniziare quando lo Splash comincia la
        // propria dissolvenza: le due dissolvenze si sovrappongono.
        // Questo delay ha senso solo al primissimo caricamento, mentre lo Splash è ancora
        // a schermo — se si torna qui navigando (es. da /cv) lo Splash non c'è più, quindi
        // niente attesa, altrimenti la pagina resterebbe invisibile per 4s senza motivo
        gsap.set(fadeRef.current, { opacity: 0 });
        gsap.to(fadeRef.current, { opacity: 1, duration: 1, delay: skipIntroDelay ? 0 : 4, ease: "power1.out" });
    }, { scope: fadeRef });



    return (
        // .Provider è il componente che distribuisce il value ai discendenti
        <AppContext.Provider
            value={{
                // qui vanno i dati/funzioni condivisi
                fadeRef,
                cursorRef
            }}
        >
            {/* z-50: senza uno z-index esplicito, questo div (position:fixed,
                z-index:auto) finisce nello stesso "livello" di impilamento dei
                contenitori position:relative delle pagine (es. IndexPage), e
                venendo dopo nel DOM questi ultimi lo coprono completamente.
                pointer-events-none: essendo sempre sotto il mouse, altrimenti
                bloccherebbe click/hover su link e bottoni della pagina */}
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