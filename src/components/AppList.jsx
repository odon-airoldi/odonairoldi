import { Link } from "react-router-dom"
import { createPortal } from "react-dom"
import { useRef, useState } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { createInfiniteGallery } from "../utils/gsap"

gsap.registerPlugin(useGSAP)

// lista a due livelli (titolo + voci) usata da Stack, Formazione, Esperienza e Work.
// Una voce può essere una stringa (semplice riga di testo) oppure un oggetto
// (come in Work): in quel caso diventa un bottone che apre il contenuto
// corrispondente — se ha `url` mostra descrizione e link, se ha `gallery` apre la
// gallery a schermo intero
export default function AppList({ list }) {

    const [openId, setOpenId] = useState(null)

    // gallery infinita e trascinabile (vedi createInfiniteGallery in utils/gsap):
    // itemsRef/dragProxyRef vivono dentro il portal, montati solo per la voce
    // aperta. useGSAP dipende da openId, quindi ad ogni apertura/chiusura/cambio la
    // gallery precedente viene ripulita (via la funzione di cleanup ritornata) e se
    // ne crea una nuova. Lo swipe verso l'alto la chiude come il click sullo sfondo
    const itemsRef = useRef(null)
    const dragProxyRef = useRef(null)

    useGSAP(() => {
        if (!itemsRef.current) return
        return createInfiniteGallery(itemsRef.current, dragProxyRef.current, () => setOpenId(null))
    }, { dependencies: [openId] })

    return (
        <ul className="text-[.625rem] lg:text-xs tracking-widest grid grid-rows-1 gap-y-[2vw]">
            {
                list.map((item) => (
                    <li key={item.id} className="font-extralight leading-[1.5]">
                        <span className="inline-block reveal-shift max-sm:text-right">{item.title}</span>
                        <ul className="ul">
                            {
                                item.items.map((voce) => (
                                    typeof voce === "string" ? (
                                        <li key={voce}>{voce}</li>
                                    ) : (
                                        <li key={voce.id} className="relative">
                                            <button className="cursor-pointer flex gap-1 items-center" onClick={() => setOpenId(openId === voce.id ? null : voce.id)}>
                                                <span>{voce.title}</span>
                                                <span className="relative w-2 h-2 mt-[1px]">
                                                    <span className="absolute top-0 left-0 w-6/8 h-1/8 bg-stone-200"></span>
                                                    <span className="absolute top-0 left-0 w-1/8 h-6/8 bg-stone-200"></span>
                                                    <span className="absolute top-2/8 left-2/8 w-6/8 h-1/8 bg-stone-200"></span>
                                                    <span className="absolute top-2/8 left-2/8 w-1/8 h-6/8 bg-stone-200"></span>
                                                    <span className="absolute top-2/8 left-7/8 w-1/8 h-6/8 bg-stone-200"></span>
                                                    <span className="absolute top-7/8 left-2/8 w-6/8 h-1/8 bg-stone-200"></span>
                                                </span>
                                            </button>
                                            {openId === voce.id && voce.url &&
                                                <div className="pt-2 pb-8 w-full">
                                                    <span className="absolute top-[.8em] -left-[2.75em] w-[2.25em] h-[1em] block bg-orange-600-">
                                                        <span className="absolute top-0 left-0 w-full h-[1px] bg-stone-200"></span>
                                                        <span className="absolute top-0 left-0 w-[1px] h-full bg-stone-200"></span>
                                                    </span>
                                                    <div className="text-[.625rem] xl:text-xs block -ms-[3em]">
                                                        <p>{voce.description}</p>
                                                        <Link to={voce.url} target="_blank">Visita {voce.title}</Link>
                                                    </div>
                                                </div>
                                            }
                                            {openId === voce.id && voce.gallery && createPortal(
                                                <div className="fixed z-50 inset-0 flex items-center justify-center overflow-hidden">
                                                    <div className="absolute inset-0 z-51 bg-zinc-950/75" onClick={() => setOpenId(null)}></div>
                                                    <ul className="grid place-items-center z-52" ref={itemsRef}>
                                                        {voce.gallery.map((img) => (
                                                            <li key={img} className="col-start-1 row-start-1 w-[100vw]">
                                                                <img src={img} draggable={false} className="w-full h-auto pointer-events-none" />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="drag-proxy hidden" ref={dragProxyRef}></div>
                                                </div>, document.body)
                                            }
                                        </li>
                                    )
                                ))
                            }
                        </ul>
                    </li>
                ))
            }
        </ul>
    )
}
