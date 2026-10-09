import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

// registrato una volta sola, nell'unico modulo che usa Draggable
gsap.registerPlugin(Draggable);

// animazioni di ingresso:
// - il genitore .alive decide QUANDO (ordine della sequenza, ingresso nello schermo)
// - la classe del figlio decide COME: stato di partenza (from) e finale (to)
const REVEALS = {
    "word-reveal": { from: { y: "100%", opacity: 0 }, to: { y: "0%", opacity: 1, ease: "power4.out" } },
    "reveal-shift": { from: { x: 0, opacity: 0 }, to: { x: "-100%", opacity: 1, ease: "power2.out" } },
    "ul": { from: { x: 16, opacity: 0 }, to: { x: 0, opacity: 1, ease: "power2.out" } },
};
const REVEAL_SELECTOR = Object.keys(REVEALS).map((name) => `.${name}`).join(", ");
const revealOf = (el) => REVEALS[Object.keys(REVEALS).find((name) => el.classList.contains(name))];

// secondi tra un figlio e il successivo; un genitore può sovrascriverlo con
// data-stagger (es. "0.02" per un testo lungo)
const CHILD_STAGGER = 0.08;
const staggerOf = (parent) => Number(parent.dataset.stagger) || CHILD_STAGGER;

// false per gli elementi non disegnati (display:none, anche su un antenato):
// così chi è nascosto a un breakpoint non occupa un posto nella sequenza
const isDrawn = (el) => el.getClientRects().length > 0;

// ordine di lettura a schermo: dall'alto in basso, poi da sinistra a destra.
// Conta la posizione visiva, non quella nel DOM
function byScreenPosition(a, b) {
    const ra = a.getBoundingClientRect();
    const rb = b.getBoundingClientRect();
    return ra.top !== rb.top ? ra.top - rb.top : ra.left - rb.left;
}

// genitori .alive visibili, in ordine di lettura, con i loro figli visibili
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

// porta i figli nello stato di partenza. Si chiama subito, durante la splash,
// così quando l'animazione parte non c'è nessuno scatto
export function setReveal() {
    aliveGroups().forEach(({ children }) =>
        children.forEach((el) => gsap.set(el, revealOf(el).from))
    );
}

// una timeline in pausa per genitore, comandata da un IntersectionObserver
// (gestisce da solo fixed e sticky):
// - entra nello schermo: parte. I genitori che entrano insieme partono in
//   ordine di lettura, ognuno uno stagger dopo l'ultimo figlio del precedente
// - esce dallo schermo: torna allo stato di partenza, al rientro si ripete
// Ritorna la funzione che scollega l'observer, da ritornare da useGSAP
export function toReveal() {
    const timelines = new Map(aliveGroups().map(({ parent, children }) => {
        const stagger = staggerOf(parent);
        const tl = gsap.timeline({ paused: true });
        children.forEach((el, i) => tl.to(el, { ...revealOf(el).to, duration: .8 }, i * stagger));
        return [parent, tl];
    }));

    const observer = new IntersectionObserver((entries) => {
        let start = 0;
        entries
            .filter(({ isIntersecting }) => isIntersecting)
            .map(({ target }) => target)
            .sort(byScreenPosition)
            .forEach((parent) => {
                const tl = timelines.get(parent);
                tl.delay(start).restart(true);
                start += tl.getChildren().length * staggerOf(parent);
            });

        entries
            .filter(({ isIntersecting }) => !isIntersecting)
            .forEach(({ target }) => timelines.get(target).pause(0));
    });

    timelines.forEach((_, parent) => observer.observe(parent));
    return () => observer.disconnect();
}

// posiziona ogni slide in base alla distanza dalla posizione corrente,
// avvolta nell'intervallo (-count/2, count/2] per avere un loop infinito.
// Le slide sono già centrate dal CSS (stessa cella della grid):
// xPercent sposta solo di quanto serve
function layoutItems(items, position) {
    const count = items.length;
    items.forEach((el, i) => {
        let delta = ((i - position) % count + count) % count;
        if (delta > count / 2) delta -= count;
        gsap.set(el, { xPercent: delta * 100 });
    });
}

// gallery infinita e trascinabile:
// - itemsEl: il contenitore delle slide
// - dragProxyEl: elemento invisibile trascinato al posto delle slide, che
//   hanno già xPercent gestito da layoutItems
// - onClose: chiamata dopo lo swipe verso l'alto, a slide già uscite
// Ritorna la funzione di cleanup
export function createInfiniteGallery(itemsEl, dragProxyEl, onClose) {
    const items = gsap.utils.toArray(itemsEl.children);
    const count = items.length;

    const position = { value: 0 };
    layoutItems(items, position.value);

    let settleTween = null;
    let swipeTween = null;

    // pixel verso l'alto necessari per chiudere
    const closeThreshold = 100;

    const draggable = Draggable.create(dragProxyEl, {
        // lockAxis: un asse per gesto. Attenzione: lockedAxis è l'asse
        // BLOCCATO, quindi uno swipe verticale ha lockedAxis "x"
        type: "x,y",
        lockAxis: true,
        trigger: itemsEl,
        onPress() {
            settleTween?.kill();
            swipeTween?.kill();
            this.startPosition = position.value;
            // larghezza della slide al centro, per convertire pixel in slide
            const closest = ((Math.round(position.value) % count) + count) % count;
            this.itemWidth = items[closest].offsetWidth;
        },
        onDrag() {
            // swipe verticale: segue il dito, solo verso l'alto
            if (this.lockedAxis === "x") {
                const y = Math.min(0, this.y - this.startY);
                gsap.set(itemsEl, { y });
                return;
            }

            // scorrimento orizzontale 1:1 con il dito
            position.value = this.startPosition - (this.x - this.startX) / this.itemWidth;
            layoutItems(items, position.value);
        },
        onDragEnd() {
            // swipe verticale: oltre la soglia esce e chiude, altrimenti torna giù
            if (this.lockedAxis === "x") {
                const closing = this.y - this.startY < -closeThreshold;
                swipeTween = gsap.to(itemsEl, closing
                    ? { y: -window.innerHeight, duration: 0.3, ease: "power2.in", onComplete: onClose }
                    : { y: 0, duration: 0.3, ease: "power3.out" }
                );
                return;
            }

            // scatta alla slide vicina se ci si è spostati oltre la soglia
            // (in frazioni di slide), altrimenti torna a quella di partenza
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
