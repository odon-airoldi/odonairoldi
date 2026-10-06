import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"

gsap.registerPlugin(useGSAP)

export default function AppLogo() {
    const logoRef = useRef(null);

    useGSAP(() => {
        const [d1, d2, d3, d4, d5, d6, d7, d8] = logoRef.current.children;

        // il logo è una griglia di 8×4 unità quadrate (aspect 2/1): u è il lato di
        // un'unità in pixel, ricavato dalla larghezza reale del contenitore. Tutti i
        // valori qui sotto sono espressi in unità e convertiti con u solo al momento
        // di passarli a gsap, così l'animazione segue la dimensione data al contenitore
        const u = logoRef.current.offsetWidth / 8;

        // sqX/sqY sono la posizione (offset gsap) da fermi nel quadrato 3×3 con il buco
        // al centro, startX/startY il punto di partenza comune (impilati al centro del
        // logo, 4,2), w la larghezza finale del pezzo. d1-d3 lato sinistro, d4-d5 centro
        // (indigo), d6-d8 lato destro
        const items = [
            { el: d1, sqX: 2, sqY: -0.5, w: 2, startX: 3, startY: 0.5 },
            { el: d2, sqX: 2.5, sqY: -0.5, w: 1, startX: 3.5, startY: -0.5 },
            { el: d3, sqX: 2, sqY: -0.5, w: 2, startX: 3, startY: -1.5 },
            { el: d4, sqX: 0, sqY: 0.5, w: 4, startX: 0, startY: 1.5 },
            { el: d5, sqX: 0, sqY: 0.5, w: 4, startX: 0, startY: -0.5 },
            { el: d6, sqX: -2, sqY: -0.5, w: 2, startX: -3, startY: 0.5 },
            { el: d7, sqX: -2.5, sqY: -0.5, w: 1, startX: -3.5, startY: -0.5 },
            { el: d8, sqX: -2, sqY: -0.5, w: 2, startX: -3, startY: -1.5 },
        ];
        // la larghezza resta quella in percentuale del CSS: per "crescere" si anima scaleX
        // (partendo da 1 unità di larghezza) invece di width — resta sempre a compositing
        // GPU, non forza reflow di layout
        items.forEach(({ el, startX, startY, w }) =>
            gsap.set(el, { x: startX * u, y: startY * u, scaleX: 1 / w, transformOrigin: 'center center', opacity: 1 })
        );

        const tl = gsap.timeline({ delay: .2 });

        // fase 0: gli 8 pezzi partono impilati nel centro del logo, piccoli (1 unità) e
        // invisibili. Appaiono in dissolvenza mentre si aprono verso la loro posizione nel
        // quadrato, restando 1 unità, tutti insieme senza sfalsamento e con la stessa durata:
        // simmetria orizzontale garantita, dato che ogni coppia sinistra/destra parte dallo
        // stesso punto e percorre la stessa distanza specchiata — nessun cambio di
        // dimensione durante questo movimento
        tl.to(items.map(({ el }) => el), {
            x: (i) => items[i].sqX * u,
            y: (i) => items[i].sqY * u,
            opacity: 1,
            duration: .6,
            ease: "power4.inOut",
        });
        tl.addLabel("explode", "+=0.2");

        // passo 1: gli angoli (1,3,6,8) vanno verso l'esterno (x: 0 è la loro posizione
        // finale, quella del CSS) e nel frattempo crescono fino alla larghezza finale —
        // il pezzo arriva direttamente nella sua posizione e forma finale.
        // Contemporaneamente i lati (2,7), che restano 1 unità (non crescono), vanno anch'essi
        // verso l'esterno, alla loro posizione finale in x. Gli indigo (4,5) restano fermi
        // in x, non ancora coinvolti
        tl.to([d1, d3, d6, d8], {
            x: 0,
            scaleX: 1,
            duration: .6,
            ease: "power4.inOut",
        }, "explode");
        tl.to([d2, d7], {
            x: 0,
            duration: .6,
            ease: "power4.inOut",
        }, "explode");
        tl.to([d4, d5], {
            scaleX: 1,
            duration: .6,
            ease: "power4.inOut",
        }, "explode");

        // passo 2: infine, gli indigo (4 e 5) e tutti gli altri si muovono insieme verso
        // y:0 — la posizione nel quadrato è stata spostata di mezza unità più in alto per
        // tutti (sqY sopra), quindi gli indigo scendono di mezza unità verso il basso e tutti
        // gli altri salgono di mezza unità verso l'alto, incontrandosi esattamente nella
        // posizione finale (lo spostamento è spalmato su due gruppi invece che fatto fare
        // tutto agli indigo da soli) — 4 sale per primo, 5 lo segue
        tl.to([d1, d2, d3, d6, d7, d8], { y: 0, duration: .8, ease: "power4.inOut", delay: .2 });
        tl.to([d4, d5], { y: 0, duration: .8, ease: "power4.inOut" }, "<");

        return () => tl.kill();
    }, { scope: logoRef });

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
