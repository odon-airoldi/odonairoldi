
import { useRef } from "react"
import { Link } from "react-router-dom"
import AppHeader from "../components/AppHeader"
import AppFooter from "../components/AppFooter"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export default function IndexPage() {



    return (

        <div className="h-svh">

            <div className="grid grid-cols-6">

                <div className="col-span-1 col-start-2">
                    <h3 className="text-lg/4 uppercase"><Link to="/">OA</Link></h3>
                </div>
                <div className="col-span-1">
                    <h3 className="text-lg/4 uppercase"><Link to="/cv">CV</Link></h3>
                </div>
                <div className="col-span-1">
                    <h3 className="text-lg/4 uppercase mb-4">Stack</h3>
                    <ul className="text-sm tracking-[.1em]">
                        <li className="mb-4 font-extralight">
                            <span className="inline-block -translate-x-full">Frontend</span>
                            <ul className="">
                                <li>React</li>
                                <li>JavaScript</li>
                                <li>Tailwind</li>
                                <li>Bootstrap</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block -translate-x-full">Backend</span>
                            <ul className="">
                                <li>Node</li>
                                <li>Express</li>
                                <li>Php</li>
                                <li>Laravel</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block -translate-x-full">Database</span>
                            <ul className="">
                                <li>Mysql</li>
                                <li>Sqlite</li>
                            </ul>
                        </li>
                        <li className="mb-4 font-extralight">
                            <span className="inline-block -translate-x-full">Cms</span>
                            <ul className="">
                                <li>Wordpress</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className="col-span-1">
                    <h3 className="text-lg/4 uppercase mb-4">Work</h3>
                    <ul className="text-sm tracking-[.1em]">
                        <li className="mb-6 font-extralight">
                            <span className="inline-block -translate-x-full">WebSite</span>
                            <ul className="">
                                <li>run-club.dev</li>
                                <li><a href="https://www.tuttocialde.it">tuttocialde.it</a></li>
                                <li><a href="https://www.caffeagostani.com">caffeagostani.com</a></li>
                                <li><a href="https://geomont.com">geomont.com</a></li>
                                <li><a href="https://essense-magazine.com">essense-magazine.com</a></li>
                                <li><a href="https://www.studiofotograficolops.it">studiofotograficolops.it</a></li>
                            </ul>
                        </li>
                        <li className="mb-6 font-extralight">
                            <span className="inline-block -translate-x-full">Graphic</span>
                            <ul className="">
                                <li>Tenuta Casa Virginia</li>
                                <li>Le Corne</li>
                                <li>Nove Lune</li>
                                <li>Bergamo Sposi</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="absolute bottom-10 inset-x-4 overflow-hidden">
                <h1 className="text-8xl uppercase font-medium leading-20 tracking-tighter text-justify text-justify-last">
                    <span className="block">Odon Airoldi </span>
                    <span className="block">fullstack developer </span>
                    <span className="block">from graphic design</span>
                </h1>
            </div>

        </div >
    )
}