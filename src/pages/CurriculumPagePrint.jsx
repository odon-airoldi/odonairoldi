
import { Link } from "react-router-dom";
import { stack, formazione, esperienza, work } from "../data/data"

export default function CurriculumPagePrint() {

    return (
        <div className="p-[8pt] bg-white text-black font-zalando font-stretch-[117.5%]">

            <div className="grid grid-cols-12 gap-x-2 xl:gap-x-4 gap-y-[24pt]">
                <div className="col-span-12">
                    <p className="text-[16pt] font-extralight uppercase leading-none">
                        Formazione artistica ed esperienza nel graphic design sono all'origine del mio orientamento allo sviluppo web. Ho intrapreso questa direzione nel corso delle mie esperienze professionali, per poi consolidarla attraverso un percorso formativo fullstack. Metodo progettuale e sensibilità visiva accompagnano oggi il mio lavoro da sviluppatore.
                    </p>
                </div>
                <div className="col-span-3">
                    <div className="text-[6pt] font-normal word-spacing-[.5em] leading-none tracking-wide uppercase border-t border-black pt-[6pt]">
                        Odon Airoldi
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="text-[6pt] font-normal word-spacing-[.5em] leading-none tracking-wide uppercase border-t border-black pt-[6pt]">
                        23900
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="text-[6pt] font-normal word-spacing-[.5em] leading-none tracking-wide uppercase border-t border-black pt-[6pt]">
                        17 12 87
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="text-[6pt] font-normal word-spacing-[.5em] leading-none tracking-wide uppercase border-t border-black pt-[6pt]">
                        <Link to="https://www.odon-airoldi.com">odon-airoldi.com</Link>
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="text-[6pt] font-normal word-spacing-[.5em] leading-none tracking-wide uppercase border-t border-black pt-[6pt]">
                        odon.airoldi@gmail.com
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="text-[6pt] font-normal word-spacing-[.5em] leading-none tracking-wide uppercase border-t border-black pt-[6pt]">
                        3409900243
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="text-[6pt] font-normal word-spacing-[.5em] leading-none tracking-wide uppercase border-t border-black pt-[6pt]">
                        <Link to="https://www.linkedin.com/in/odon-airoldi/">linkedin.com/in/odon-airoldi</Link>
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="text-[6pt] font-normal word-spacing-[.5em] leading-none tracking-wide uppercase border-t border-black pt-[6pt]">
                        <Link to="https://github.com/odon-airoldi">github.com/odon-airoldi</Link>
                    </div>
                </div>
                <div className="col-span-4 col-start-5">
                    <div className="text-[8pt] font-light leading-none tracking-wide uppercase border-t border-black pt-[6pt] mb-[8pt]">
                        Formazione
                    </div>
                    <ul className="text-[6pt] tracking-widest grid gap-y-[8pt]">
                        {
                            formazione.map((item) => (
                                <li key={item.id}>
                                    <span className="inline-block -translate-x-full">{item.title}</span>
                                    <ul>
                                        {
                                            item.items.map((voce) => (
                                                <li key={voce}>{voce}</li>
                                            ))
                                        }
                                    </ul>
                                </li>
                            ))
                        }
                    </ul>

                </div>
                <div className="col-span-4">
                    <div className="text-[8pt] font-light leading-none tracking-wide uppercase border-t border-black pt-[6pt] mb-[8pt]">
                        Esperienza
                    </div>
                    <ul className="text-[6pt] tracking-widest grid gap-y-[8pt]">
                        {
                            esperienza.map((item) => (
                                <li key={item.id}>
                                    <span className="inline-block -translate-x-full">{item.title}</span>
                                    <ul>
                                        {
                                            item.items.map((voce) => (
                                                <li key={voce}>{voce}</li>
                                            ))
                                        }
                                    </ul>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="col-span-4 col-start-5">
                    <div className="text-[8pt] font-light leading-none tracking-wide uppercase border-t border-black pt-[6pt] mb-[8pt]">
                        Stack
                    </div>
                    <ul className="text-[6pt] tracking-widest grid gap-y-[8pt]">
                        {
                            stack.map((item) => (
                                <li key={item.id}>
                                    <span className="inline-block -translate-x-full">{item.title}</span>
                                    <ul>
                                        {
                                            item.items.map((voce) => (
                                                <li key={voce}>{voce}</li>
                                            ))
                                        }
                                    </ul>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="col-span-4">
                    <div className="text-[8pt] font-light leading-none tracking-wide uppercase border-t border-black pt-[6pt] mb-[8pt]">
                        Work
                    </div>
                    <ul className="text-[6pt] tracking-widest grid gap-y-[8pt]">
                        {
                            work
                                .filter((item) => item.title === "Websites")
                                .map((item) => (
                                    <li key={item.id}>
                                        <span className="inline-block -translate-x-full">{item.title}</span>
                                        <ul>
                                            {
                                                item.items.map((voce) => (
                                                    <li key={voce.title}>{voce.title}</li>
                                                ))
                                            }
                                        </ul>
                                    </li>
                                ))
                        }
                    </ul>
                </div>
            </div>
        </div >
    );
}

