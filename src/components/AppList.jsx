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
    // ne crea una nuova
    const itemsRef = useRef(null)
    const dragProxyRef = useRef(null)

    useGSAP(() => {
        if (!itemsRef.current) return
        return createInfiniteGallery(itemsRef.current, dragProxyRef.current)
    }, { dependencies: [openId] })

    return (
        <ul className="text-[.625rem] lg:text-xs xl:text-sm tracking-widest grid grid-rows-1 gap-y-[2vw]">
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
                                        <li key={voce.id}>
                                            <button className="cursor-pointer flex gap-1 items-center" onClick={() => setOpenId(openId === voce.id ? null : voce.id)}>
                                                <span>{voce.title}</span>
                                                <span className="relative w-[8px] h-[8px]">
                                                    <span className="absolute top-[0px] left-[0px] w-[6px] h-[1px] bg-stone-200"></span>
                                                    <span className="absolute top-[0px] left-[0px] w-[1px] h-[6px] bg-stone-200"></span>
                                                    <span className="absolute top-[2px] left-[2px] w-[6px] h-[1px] bg-stone-200"></span>
                                                    <span className="absolute top-[2px] left-[2px] w-[1px] h-[6px] bg-stone-200"></span>
                                                    <span className="absolute top-[2px] left-[7px] w-[1px] h-[6px] bg-stone-200"></span>
                                                    <span className="absolute top-[7px] left-[2px] w-[6px] h-[1px] bg-stone-200"></span>
                                                </span>
                                            </button>
                                            {openId === voce.id && voce.url &&
                                                <div className="pt-2 pb-8 w-full">
                                                    <Link to={voce.url} target="_blank" className="text-[.625rem] xl:text-xs block">
                                                        {voce.description}
                                                        <div>Visita {voce.title}</div>
                                                    </Link>
                                                </div>
                                            }
                                            {openId === voce.id && voce.gallery && createPortal(
                                                <div className="fixed z-50 inset-0 flex items-center justify-center overflow-hidden">
                                                    <div className="absolute inset-0 z-51" onClick={() => setOpenId(null)}></div>
                                                    <ul className="grid place-items-center z-52" ref={itemsRef}>
                                                        {voce.gallery.map((img) => (
                                                            <li key={img} className="col-start-1 row-start-1 px-1">
                                                                <img src={img} draggable={false} className="pointer-events-none" />
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
