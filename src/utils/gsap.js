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
// rivelarla — un salto visibile proprio mentre la splash sta sparendo.
// toArray e non il selettore come stringa: lo scope è il layout, quindi
// gira anche su pagine senza .reveal-shift/.ul, e con un array vuoto GSAP
// non avvisa in console come fa per un selettore che non trova niente
export function setElement() {
    gsap.set(gsap.utils.toArray(".reveal-shift"), { x: 0 });
    gsap.set(gsap.utils.toArray(".ul"), { x: 16 });
}

// le .word-reveal disegnate in questo momento: una parola nascosta a questo
// breakpoint (es. sm:hidden, o dentro un genitore max-sm:hidden) occuperebbe
// comunque un posto nello stagger, ritardando quelle dopo. getClientRects è
// vuoto per ogni elemento non disegnato, anche quando display:none è su un
// antenato. Le nascoste non vengono mai toccate da GSAP, quindi se un resize
// le mostra appaiono già al loro posto
function visibleWords() {
    return gsap.utils.toArray(".word-reveal").filter((el) => el.getClientRects().length);
}

// nasconde subito le parole visibili sotto la propria riga
export function setWordReveal() {
    gsap.set(visibleWords(), { y: "100%", opacity: 0 });
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

}

// fa risalire le parole visibili nella loro posizione, una dopo l'altra
export function toWordReveal() {
    gsap.to(visibleWords(), {
        y: "0%",
        opacity: 1,
        duration: 1,
        ease: "power4.out",
        stagger: { amount: 1.2 }
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
// Uno swipe verso l'alto chiude la gallery: onClose viene chiamata a fine
// animazione d'uscita, così React smonta la gallery solo quando è già fuori
// dallo schermo. Ritorna una funzione di cleanup da chiamare alla chiusura
export function createInfiniteGallery(itemsEl, dragProxyEl, onClose) {
    const items = gsap.utils.toArray(itemsEl.children);
    const count = items.length;

    const position = { value: 0 };
    layoutItems(items, position.value);

    let settleTween = null;
    let swipeTween = null;

    // quanti pixel verso l'alto servono per chiudere
    const closeThreshold = 100;

    const draggable = Draggable.create(dragProxyEl, {
        // lockAxis: al primo movimento Draggable sceglie un asse e blocca
        // l'altro fino al rilascio, così uno swipe un po' storto non fa
        // scorrere e chiudere insieme. Attenzione: this.lockedAxis è l'asse
        // BLOCCATO, non quello del movimento — uno swipe verticale ha
        // lockedAxis "x"
        type: "x,y",
        lockAxis: true,
        trigger: itemsEl,
        onPress() {
            settleTween?.kill();
            swipeTween?.kill();
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
            // swipe verticale: la gallery segue il dito solo verso l'alto
            // (Math.min)
            if (this.lockedAxis === "x") {
                const y = Math.min(0, this.y - this.startY);
                gsap.set(itemsEl, { y });
                return;
            }

            // trascinamento 1:1, senza easing: l'elemento segue il dito
            // esattamente, l'assestamento morbido arriva solo al rilascio
            position.value = this.startPosition - (this.x - this.startX) / this.itemWidth;
            layoutItems(items, position.value);
        },
        onDragEnd() {
            // swipe verticale: oltre la soglia la gallery esce dallo schermo
            // verso l'alto e poi si chiude, altrimenti torna al suo posto
            if (this.lockedAxis === "x") {
                const closing = this.y - this.startY < -closeThreshold;
                swipeTween = gsap.to(itemsEl, closing
                    ? { y: -window.innerHeight, duration: 0.3, ease: "power2.in", onComplete: onClose }
                    : { y: 0, duration: 0.3, ease: "power3.out" }
                );
                return;
            }

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
        swipeTween?.kill();
        draggable.kill();
    };
}