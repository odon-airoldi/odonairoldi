import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"

gsap.registerPlugin(useGSAP)

export default function AppLogo() {
    const logoRef = useRef(null);

    useGSAP(() => {
        const [d1, d2, d3, d4, d5, d6, d7, d8] = logoRef.current.children;

        // bianchi (1,2,3, lato sinistro): transformOrigin "right center" — il bordo destro
        // (quello rivolto verso il centro del quadrato) resta fermo mentre il pezzo cresce,
        // il bordo sinistro si allontana verso l'esterno. lime (6,7,8, lato destro): l'esatto
        // specchio, transformOrigin "left center", cresce verso destra. indigo (4,5, centro):
        // transformOrigin center, non ancora coinvolti in questo passo.
        // sqX è la posizione (offset gsap) da fermi nel quadrato, a 12px; startX è il punto
        // di partenza comune, impilati al centro del quadrato (42,30 nel container); w è la
        // larghezza finale del pezzo
        const items = [
            { el: d1, sqX: 18, sqY: -6, w: 24, startX: 30, startY: 6 },
            { el: d2, sqX: 24, sqY: -6, w: 12, startX: 36, startY: -6 },
            { el: d3, sqX: 18, sqY: -6, w: 24, startX: 30, startY: -18 },
            { el: d4, sqX: 0, sqY: 6, w: 36, startX: 0, startY: 18 },
            { el: d5, sqX: 0, sqY: 6, w: 36, startX: 0, startY: -6 },
            { el: d6, sqX: -18, sqY: -6, w: 24, startX: -30, startY: 6 },
            { el: d7, sqX: -24, sqY: -6, w: 12, startX: -36, startY: -6 },
            { el: d8, sqX: -18, sqY: -6, w: 24, startX: -30, startY: -18 },
        ];
        // la larghezza CSS è fissata subito al valore finale w e non viene più toccata: per
        // "crescere" si anima scaleX (con l'origine sul bordo interno, verso il centro)
        // invece di width — resta sempre a compositing GPU, non forza reflow di layout
        items.forEach(({ el, startX, startY, w }) =>
            gsap.set(el, { x: startX, y: startY, width: w, scaleX: 12 / w, transformOrigin: 'center center', opacity: 1 })
        );

        const tl = gsap.timeline({ delay: .2 });

        // fase 0: gli 8 pezzi partono impilati nel centro del quadrato, piccoli (12px) e
        // invisibili. Appaiono in dissolvenza mentre si aprono verso la loro posizione nel
        // quadrato, restando 12px, tutti insieme senza sfalsamento e con la stessa durata:
        // simmetria orizzontale garantita, dato che ogni coppia sinistra/destra parte dallo
        // stesso punto e percorre la stessa distanza specchiata — nessun cambio di
        // dimensione durante questo movimento
        tl.to(items.map(({ el }) => el), {
            x: (i) => items[i].sqX,
            y: (i) => items[i].sqY,
            opacity: 1,
            duration: .6,
            ease: "power4.inOut",
        });
        tl.addLabel("explode", "+=0.2");

        // passo 1: gli angoli (1,3,6,8) si spostano di 12px verso l'esterno e nel frattempo
        // crescono fino alla larghezza finale — l'origine sul bordo interno fa sì che le due
        // cose insieme portino il pezzo direttamente nella sua posizione e forma finale.
        // Contemporaneamente i lati (2,7), che restano 12x12 (non crescono), si spostano
        // anch'essi di 12px verso l'esterno — ancora non nella loro posizione finale, sarà
        // un passo successivo. Gli indigo (4,5) restano fermi, non ancora coinvolti
        tl.to([d1, d3, d6, d8], {
            x: (i, target) => {
                const { sqX } = items.find((it) => it.el === target);
                return sqX + (sqX > 0 ? -18 : 18);
            },
            scaleX: 1,
            duration: .6,
            ease: "power4.inOut",
        }, "explode");
        tl.to([d2, d7], {
            x: (i, target) => {
                const { sqX } = items.find((it) => it.el === target);
                return sqX + (sqX > 0 ? -24 : 24);
            },
            duration: .6,
            ease: "power4.inOut",
        }, "explode");
        tl.to([d4, d5], {
            scaleX: 1,
            duration: .6,
            ease: "power4.inOut",
        }, "explode");

        // passo 2: infine, gli indigo (4 e 5) e tutti gli altri si muovono insieme verso
        // y:0 — la posizione nel quadrato è stata spostata di 6px più in alto per tutti
        // (sqY sopra), quindi gli indigo scendono di 6px verso il basso e tutti gli altri
        // salgono di 6px verso l'alto, incontrandosi esattamente nella posizione finale
        // (identica a prima: lo spostamento è stato spalmato su due gruppi invece che
        // fatto fare tutto agli indigo da soli) — 4 sale per primo, 5 lo segue
        tl.to([d1, d2, d3, d6, d7, d8], { y: 0, duration: .8, ease: "power4.inOut", delay: .2 });
        tl.to([d4, d5], { y: 0, duration: .8, ease: "power4.inOut" }, "<");

        return () => tl.kill();
    }, { scope: logoRef });

    return (
        <div ref={logoRef} className="h-12 w-21 relative">
            <div className="bg-zinc-200 h-3 w-6 absolute left-0 top-3"></div>
            <div className="bg-zinc-200 h-3 w-3 absolute left-0 top-6"></div>
            <div className="bg-zinc-200 h-3 w-6 absolute left-0 top-9"></div>

            <div className="bg-zinc-200 h-3 w-9 absolute left-6 top-0"></div>
            <div className="bg-zinc-200 h-3 w-9 absolute left-6 top-6"></div>

            <div className="bg-zinc-200 h-3 w-6 absolute left-15 top-3"></div>
            <div className="bg-zinc-200 h-3 w-3 absolute left-18 top-6"></div>
            <div className="bg-zinc-200 h-3 w-6 absolute left-15 top-9"></div>
        </div>
    );
}
