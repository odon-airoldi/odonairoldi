import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

// registrato qui, non nelle pagine che lo usano: questo modulo è l'unico che
// usa davvero scrollTrigger/Draggable, quindi è il posto giusto per
// garantirne la disponibilità indipendentemente da quale pagina viene
// caricata per prima
gsap.registerPlugin(ScrollTrigger, Draggable);

// animazioni di ingresso, in due livelli:
// - il genitore .alive decide QUANDO: è l'unità della sequenza (i genitori
//   partono in ordine di documento) e il trigger dello ScrollTrigger. Non si
//   muove mai, quindi ScrollTrigger ne misura la posizione esatta
// - la classe del figlio decide COME: qui sotto, per ogni classe, lo stato di
//   partenza (from) e quello finale (to). La posizione di partenza vive solo
//   qui, niente classi Tailwind come -translate-x-full sull'elemento
const REVEALS = {
    "word-reveal": { from: { y: "100%", opacity: 0 }, to: { y: "0%", opacity: 1, ease: "power4.out" } },
    "reveal-shift": { from: { x: 0 }, to: { x: "-100%", ease: "power2.out" } },
    "ul": { from: { x: 16 }, to: { x: 0, ease: "power2.out" } },
};
const REVEAL_SELECTOR = Object.keys(REVEALS).map((name) => `.${name}`).join(", ");
const revealOf = (el) => REVEALS[Object.keys(REVEALS).find((name) => el.classList.contains(name))];

// secondi tra un figlio e il successivo dentro lo stesso genitore. Un
// genitore può averne uno suo con data-stagger (es. data-stagger="0.02" su un
// blocco di testo lungo, che altrimenti terrebbe in fila tutto il resto)
const CHILD_STAGGER = 0.08;
const staggerOf = (parent) => Number(parent.dataset.stagger) || CHILD_STAGGER;

// getClientRects è vuoto per ogni elemento non disegnato, anche quando
// display:none è su un antenato: un elemento nascosto a questo breakpoint
// (es. sm:hidden) occuperebbe comunque un posto nella sequenza, ritardando
// quelli dopo. I nascosti non vengono mai toccati da GSAP, quindi se un
// resize li mostra appaiono già al loro posto
const isDrawn = (el) => el.getClientRects().length > 0;

// ordine di lettura a schermo: prima chi sta più in alto, a parità di riga chi
// sta più a sinistra. Conta la posizione visiva, non quella nel DOM: in home
// le liste di Stack/Work nel DOM stanno subito dopo i loro titoli, ma a
// schermo sono sotto CV ed Email, e devono partire dopo
function byScreenPosition(a, b) {
    const ra = a.getBoundingClientRect();
    const rb = b.getBoundingClientRect();
    return ra.top !== rb.top ? ra.top - rb.top : ra.left - rb.left;
}

// ogni genitore .alive visibile, in ordine di lettura a schermo, con i propri
// figli animati visibili. I genitori non si muovono mai, quindi la loro
// posizione è quella finale anche mentre i figli sono ancora spostati
function aliveGroups() {
    return gsap.utils.toArray(".alive")
        .filter(isDrawn)
        .sort(byScreenPosition)
        .map((parent) => ({
            parent,
            children: gsap.utils.toArray(parent.querySelectorAll(REVEAL_SELECTOR))
                .filter(isDrawn),
        }))
        .filter(({ children }) => children.length);
}

// porta subito ogni figlio nel suo stato di partenza. Va chiamata appena il
// componente monta, e resta così per tutta la durata della splash (che
// comunque lo copre): quando poi toReveal lo anima parte già da lì, senza
// scatti. Con un fromTo dentro toReveal (chiamata solo a splash finita)
// l'elemento salterebbe dalla posizione naturale a quella di partenza proprio
// mentre la splash sta sparendo
export function setReveal() {
    aliveGroups().forEach(({ children }) =>
        children.forEach((el) => gsap.set(el, revealOf(el).from))
    );
}

// per ogni genitore una timeline che anima i suoi figli con uno stagger.
// ScrollTrigger.batch raccoglie i genitori che entrano nello schermo nello
// stesso momento (all'apertura della pagina tutti quelli già visibili, poi
// quelli che arrivano con lo scroll) e li passa in ordine: dentro ogni gruppo
// ogni timeline parte appena la precedente ha avviato il suo ultimo figlio,
// uno stagger dopo, senza aspettare che finisca. Il delay avanza quindi di
// uno stagger per ogni figlio: i figli di tutti i genitori si susseguono con
// lo stesso ritmo, e anche un genitore con un solo figlio occupa il suo passo.
// Le timeline si creano subito, in pausa, e al momento giusto si fanno solo
// ripartire: create qui in modo sincrono restano registrate nel contesto di
// useGSAP, che le annulla al cambio pagina. Create dentro onEnter (più tardi)
// sfuggirebbero al contesto e continuerebbero a girare.
// start "top bottom", cioè appena il genitore entra nello schermo: gli
// elementi fixed vicino al fondo (es. LC nel footer) non scorrono mai, e con
// una soglia più alta non partirebbero
export function toReveal() {
    const timelines = new Map(aliveGroups().map(({ parent, children }) => {
        const stagger = staggerOf(parent);
        const tl = gsap.timeline({ paused: true });
        children.forEach((el, i) => tl.to(el, { ...revealOf(el).to, duration: .8 }, i * stagger));
        return [parent, tl];
    }));

    ScrollTrigger.batch([...timelines.keys()], {
        start: "top bottom",
        once: true,
        // l'ordine in cui ScrollTrigger passa il gruppo non è garantito: lo si
        // riporta a quello di lettura
        onEnter: (batch) => {
            let start = 0;
            batch.sort(byScreenPosition).forEach((parent) => {
                const tl = timelines.get(parent);
                tl.delay(start).restart(true);
                start += tl.getChildren().length * staggerOf(parent);
            });
        },
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