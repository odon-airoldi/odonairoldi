import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

// registrato qui, non nelle pagine che lo usano: questo modulo è l'unico che
// usa davvero scrollTrigger/Draggable, quindi è il posto giusto per
// garantirne la disponibilità indipendentemente da quale pagina viene
// caricata per prima
gsap.registerPlugin(ScrollTrigger, Draggable);

// posiziona subito .reveal-shift e .ul nel loro stato nascosto/di partenza
// (niente classi Tailwind come -translate-x-full sull'elemento: la posizione
// vive solo qui). Va chiamata incondizionatamente, appena il componente
// monta — resta nascosta per tutta la durata della splash (che comunque la
// copre) così quando poi startRevealShift la anima parte già da lì, senza
// scatti. Se invece si usasse fromTo con immediateRender per fare le due
// cose insieme dentro startRevealShift (chiamata solo a splash finita),
// l'elemento salterebbe dalla sua posizione naturale (0, mai stata nascosta)
// a quella di partenza nel momento stesso in cui l'animazione dovrebbe solo
// rivelarla — un salto visibile proprio mentre la splash sta sparendo
export function setElement() {
    gsap.set(".reveal-shift", { x: 0 });
    gsap.set(".ul", { x: 16 });
    gsap.set(".reveal-text", { y: "100%", opacity: 0 });
}

// anima .reveal-shift e .ul verso la loro posizione finale (x: 0) quando
// entrano nello schermo, uno ScrollTrigger indipendente per elemento. Uso
// gsap.to, non fromTo: il punto di partenza è già quello impostato da
// hideRevealShift, quindi non va ridichiarato — altrimenti l'elemento
// verrebbe prima ri-portato lì (anche se ci si trova già) e poi animato
export function toElement() {
    gsap.utils.toArray(".reveal-shift").forEach((el) => {
        gsap.to(el, {
            x: "-100%",
            duration: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%" }
        });
    });

    gsap.utils.toArray(".ul").forEach((el) => {
        gsap.to(el, {
            x: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%" }
        });
    });

    gsap.to(".reveal-text", {
        y: "0%",
        opacity: 1,
        duration: 1,
        ease: "power4.out",
        stagger: (i) => Math.floor(i / 4) * 0.1
    });

}

// posiziona ogni elemento in base alla propria distanza (in "elementi", non
// in pixel) dalla posizione corrente, avvolta ciclicamente nell'intervallo
// (-count/2, count/2]: è la STESSA posizione a pilotare tutti gli elementi
// insieme, quindi muovendo quello centrale gli altri si spostano di
// conseguenza nello stesso istante, invece di restare fermi finché non
// tocca a loro. Il centraggio di ogni singolo elemento è gratuito (CSS Grid,
// tutte le <li> nella stessa cella via grid-area:1/1, place-items-center sul
// contenitore): xPercent qui porta solo il delta di scorrimento, senza
// bisogno di compensare un ancoraggio in un angolo
function layoutItems(items, position) {
    const count = items.length;
    items.forEach((el, i) => {
        let delta = ((i - position) % count + count) % count;
        if (delta > count / 2) delta -= count;
        gsap.set(el, { xPercent: delta * 100 });
    });
}

// gallery infinita e trascinabile, senza pulsanti prev/next: itemsEl è
// l'elemento che contiene gli elementi (le sue figlie dirette), dragProxyEl
// un elemento invisibile usato solo come "maniglia" per Draggable — se
// Draggable trascinasse direttamente gli elementi, entrerebbe in conflitto
// con xPercent, che layoutItems scrive già su di loro. Funziona con
// qualunque numero di elementi (3, 6, ...), non c'è nessun valore hardcoded.
// Ritorna una funzione di cleanup da chiamare alla chiusura della gallery
export function createInfiniteGallery(itemsEl, dragProxyEl) {
    const items = gsap.utils.toArray(itemsEl.children);
    const count = items.length;

    const position = { value: 0 };
    layoutItems(items, position.value);

    let settleTween = null;

    const draggable = Draggable.create(dragProxyEl, {
        type: "x",
        trigger: itemsEl,
        onPress() {
            settleTween?.kill();
            this.startPosition = position.value;
            // larghezza di riferimento per convertire i pixel trascinati in
            // "elementi": quella dell'elemento attualmente più vicino al
            // centro. Letta ad ogni pressione (non una volta sola) per
            // restare corretta anche se le immagini hanno dimensioni
            // diverse tra loro
            const closest = ((Math.round(position.value) % count) + count) % count;
            this.itemWidth = items[closest].offsetWidth;
        },
        onDrag() {
            // trascinamento 1:1, senza easing: l'elemento segue il dito
            // esattamente, l'assestamento morbido arriva solo al rilascio
            position.value = this.startPosition - (this.x - this.startX) / this.itemWidth;
            layoutItems(items, position.value);
        },
        onDragEnd() {
            // a rilascio, scatta all'elemento successivo/precedente se ci
            // si è spostati di più di "threshold" larghezze-elemento dal
            // punto di partenza, altrimenti torna a quello di partenza.
            // threshold più basso (es. 0.1) = basta trascinare meno per
            // cambiare elemento; 0.5 equivarrebbe a Math.round (serve
            // superare la metà)
            const base = Math.round(this.startPosition);
            const delta = position.value - base;
            let target = base;
            if (delta > 0.05 /* threshold */) target = base + 1;
            else if (delta < - 0.05 /* threshold */) target = base - 1;

            settleTween = gsap.to(position, {
                value: target,
                duration: 0.5,
                ease: "power3.out",
                onUpdate() {
                    layoutItems(items, position.value);
                },
            });
        },
    })[0];

    return () => {
        settleTween?.kill();
        draggable.kill();
    };
}