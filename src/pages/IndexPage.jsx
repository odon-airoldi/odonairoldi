import { Link } from "react-router-dom"
import AppLogo from "../components/AppLogo"

export default function IndexPage() {
    return (
        <div className="bg-zinc-900 text-mist-50 h-svh p-8 font-google relative">
            <div className="grid grid-cols-12">
                <div className="col-span-5">
                    <h1 className="text-6xl font-zalando-expanded font-normal">Odon Airoldi</h1>
                    <h2 className="text-2xl font-light">Full Stack Developer</h2>
                    <h2 className="text-xl font-light">Graphic Designer</h2>
                    <Link to="/cv">CV</Link>
                    <div className="p-8">
                        <AppLogo />
                    </div>
                </div>
                <div className="col-span-4 col-start-7">
                    <h3 className="font-zalando-expanded text-xl uppercase mb-6">Competenze</h3>
                    <ul className="uppercase_ tracking-[.125em]">
                        <li className="text-sm/6 mb-6 font-extralight">
                            <span className="font-zalando-expanded inline-block uppercase -translate-x-full">Frontend</span>
                            <ul className="">
                                <li>React</li>
                                <li>JavaScript</li>
                                <li>Tailwind</li>
                                <li>Bootstrap</li>
                            </ul>
                        </li>
                        <li className="text-sm/6 mb-6 font-extralight">
                            <span className="font-zalando-expanded inline-block uppercase -translate-x-full">Backend</span>
                            <ul className="">
                                <li>Node</li>
                                <li>Express</li>
                                <li>Php</li>
                                <li>Laravel</li>
                            </ul>
                        </li>
                        <li className="text-sm/6 mb-6 font-extralight">
                            <span className="font-zalando-expanded inline-block uppercase -translate-x-full">Database</span>
                            <ul className="">
                                <li>Mysql</li>
                                <li>Sqlite</li>
                            </ul>
                        </li>
                        <li className="text-sm/6 mb-6 font-extralight">
                            <span className="font-zalando-expanded inline-block uppercase -translate-x-full">Cms</span>
                            <ul className="">
                                <li>Wordpress</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className="col-span-2">
                    <h3 className="font-zalando-expanded text-xl uppercase mb-6">Progetti</h3>
                    <ul className="uppercase_ tracking-[.125em]">
                        <li className="text-sm/6 mb-6 font-extralight">
                            <span className="font-zalando-expanded inline-block uppercase -translate-x-full">Web site</span>
                            <ul className="">
                                <li>run-club.dev</li>
                                <li><a href="https://www.tuttocialde.it">tuttocialde.it</a></li>
                                <li><a href="https://www.caffeagostani.com">caffeagostani.com</a></li>
                                <li><a href="https://geomont.com">geomont.com</a></li>
                                <li><a href="https://essense-magazine.com">essense-magazine.com</a></li>
                                <li><a href="https://www.studiofotograficolops.it">studiofotograficolops.it</a></li>
                            </ul>
                        </li>
                        <li className="text-sm/6 mb-6 font-extralight">
                            <span className="font-zalando-expanded inline-block uppercase -translate-x-full">Graphic</span>
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

            <footer className="absolute bottom-0 start-0">
                {/* <div className="">
                    <div className="w-[48px] h-[48px] relative origin-top-left -rotate-45 bg-linear-[45deg] from-zinc-900 from-50% to-mist-300 to-50%">
                        <div className="w-[46px] h-[46px] rounded-full bg-zinc-900 absolute top-[1px] left-[1px]"></div>
                    </div>
                </div> */}
            </footer>

        </div>
    )
}