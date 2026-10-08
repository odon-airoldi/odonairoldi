import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"
import { useAppContext } from "../contexts/AppContext"

gsap.registerPlugin(useGSAP)

export default function AppLogo() {
    const logoRef = useRef(null);
    const { showSplash } = useAppContext();

    useGSAP(() => {
        const [d1, d2, d3, d4, d5, d6, d7, d8] = logoRef.current.children;

        // il logo è una griglia di 8×4 unità quadrate (aspect 2/1): u è il lato di
        // un'unità in pixel, ricavato dalla larghezza reale del contenitore. Tutti i
        // valori qui sotto sono espressi in unità e convertiti con u solo al momento
        // di passarli a gsap, così l'animazione segue la dimensione data al contenitore
        const u = logoRef.current.offsetWidth / 8;

        // sqX/sqY sono la posizione (offset gsap) di partenza, nel quadrato 3×3 con il
        // buco al centro, dove ogni pezzo è largo 1 unità; w la larghezza finale del
        // pezzo. d1-d3 lato sinistro, d4-d5 centro, d6-d8 lato destro.
        // Il quadrato sta già alla base del contenitore, cioè all'altezza finale dei
        // lati (righe 1-3): i lati hanno sqY 0 e non si muovono mai in verticale. I due
        // pezzi centrali stanno nella prima e nell'ultima riga del quadrato, una
        // unità sotto la loro posizione finale (righe 0 e 2)
        const items = [
            { el: d1, sqX: 2, sqY: 0, w: 2 },
            { el: d2, sqX: 2.5, sqY: 0, w: 1 },
            { el: d3, sqX: 2, sqY: 0, w: 2 },
            { el: d4, sqX: 0, sqY: 1, w: 4 },
            { el: d5, sqX: 0, sqY: 1, w: 4 },
            { el: d6, sqX: -2, sqY: 0, w: 2 },
            { el: d7, sqX: -2.5, sqY: 0, w: 1 },
            { el: d8, sqX: -2, sqY: 0, w: 2 },
        ];

        // la larghezza resta quella in percentuale del CSS: per "crescere" si anima scaleX
        // (partendo da 1 unità di larghezza) invece di width — resta sempre a compositing
        // GPU, non forza reflow di layout
        items.forEach(({ el, sqX, sqY, w }) =>
            gsap.set(el, { x: sqX * u, y: sqY * u, scaleX: 1 / w, transformOrigin: 'center center', opacity: showSplash ? 0 : 1 })
        );

        // la timeline parte solo quando showSplash passa a false: l'effetto
        // riparte (dependencies), useGSAP annulla i set precedenti e li
        // riapplica, poi crea la timeline. Creata subito, finirebbe
        // (invisibile) dietro la splash. Durante la splash i pezzi restano
        // invisibili (opacity nel set qui sopra), altrimenti si vedrebbero
        // fermi nella posizione di partenza mentre la splash svanisce
        if (showSplash) return;

        const tl = gsap.timeline({ delay: .2 });


        // passo 1: si parte dal quadrato già formato. Gli angoli (1,3,6,8) vanno verso l'esterno (x: 0 è la loro posizione
        // finale, quella del CSS) e nel frattempo crescono fino alla larghezza finale —
        // il pezzo arriva direttamente nella sua posizione e forma finale.
        // Contemporaneamente i lati (2,7), che restano 1 unità (non crescono), vanno anch'essi
        // verso l'esterno, alla loro posizione finale in x. I centrali (4,5) restano
        // fermi in x e si allargano sul posto: alla fine di questo passo il rettangolo è
        // formato e i lati sono già nella posizione finale
        tl.to([d1, d3, d6, d8], {
            x: 0,
            scaleX: 1,
            duration: .6,
            ease: "power4.inOut",
        }, 0);
        tl.to([d2, d7], {
            x: 0,
            duration: .6,
            ease: "power4.inOut",
        }, 0);
        tl.to([d4, d5], {
            scaleX: 1,
            duration: .6,
            ease: "power4.inOut",
        }, 0);

        // passo 2: solo i due pezzi centrali salgono di una unità fino alla posizione
        // finale (y: 0), mentre tutto il resto del logo è già fermo
        tl.to([d4, d5], { y: 0, duration: .8, ease: "power4.inOut", delay: .2 });

        return () => tl.kill();
    }, { scope: logoRef, dependencies: [showSplash] });

    return (

        <div ref={logoRef} className="aspect-2/1 w-full relative">
            <div className="bg-zinc-200 absolute h-1/4 w-2/8 left-0 top-1/4"></div>
            <div className="bg-zinc-200 absolute h-1/4 w-1/8 left-0 top-1/2"></div>
            <div className="bg-zinc-200 absolute h-1/4 w-2/8 left-0 top-3/4"></div>

            <div className="bg-zinc-200 absolute h-1/4 w-4/8 left-2/8 top-0"></div>
            <div className="bg-zinc-200 absolute h-1/4 w-4/8 left-2/8 top-1/2"></div>

            <div className="bg-zinc-200 absolute h-1/4 w-2/8 left-6/8 top-1/4"></div>
            <div className="bg-zinc-200 absolute h-1/4 w-1/8 left-7/8 top-1/2"></div>
            <div className="bg-zinc-200 absolute h-1/4 w-2/8 left-6/8 top-3/4"></div>
        </div>

    );
}
