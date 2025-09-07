"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);

    return (
        <header className="w-full bg-white text-white">
            <nav className="mx-auto relative flex items-center justify-between py-8 px-12 border-b-[1.5px] border-bordergray">
                <div className="font-bold text-primary text-3xl">MyEvent</div>

                <ul className="flex flex-wrap items-center gap-6">
                    <li>
                        <img
                            src="/Doorbell.png"
                            alt="Notificaciones"
                            className="w-8 h-8"
                        />
                    </li>
                    <li className="flex items-center gap-2">
                        <img
                            src="/User.png"
                            alt="Usuario"
                            className="w-8 h-8 rounded-full"
                        />
                        <p className="text-grayish text-xl">María Gonzales</p>
                    </li>
                    <li>
                        <button className="text-grayish text-xl hover:text-danger transition">
                            Cerrar Sesión
                        </button>
                    </li>
                </ul>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute right-4 -bottom-4 bg-primary text-white p-2 rounded-full shadow transition"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-5 h-5 transform transition-transform duration-500 ${isOpen ? "rotate-0" : "rotate-180"
                            }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                </button>
            </nav>
            <div className={`transition-all duration-500 ease-in-out overflow-hidden border-b-[1.5px] border-bordergray`}
                style={{
                    maxHeight: isOpen ? "200px" : "0px",
                }}            >
                <nav className="mx-auto flex items-center justify-between px-20">
                    <ul className="flex flex-wrap items-center gap-6">
                        <li className={`py-8 ${pathname === "/" ? "border-b-2 border-primary" : ""}`}>
                            <Link href="/" className={`text-xl text-headertext ${pathname === "/" ? "text-primary" : "hover:text-grayish"}`}>
                                Resumen
                            </Link>
                        </li>
                        <li className={`py-8 ${pathname === "/misEventos" ? "border-b-2 border-primary" : ""}`}>
                            <Link href="/misEventos" className={`text-xl text-headertext ${pathname === "/misEventos" ? "text-primary" : "hover:text-grayish"}`}>
                                Mis Eventos
                            </Link>
                        </li>
                        <li className={`py-8 ${pathname === "/eventosAsistidos" ? "border-b-2 border-primary" : ""}`}>
                            <Link href="/eventosAsistidos" className={`text-xl text-headertext ${pathname === "/eventosAsistidos" ? "text-primary" : "hover:text-grayish"}`}>
                                Eventos a los que asistió
                            </Link>
                        </li>
                        <li className="py-8">
                            <Link href="/eventosGuardados" className="text-xl text-headertext hover:text-grayish">
                                Eventos Guardados
                            </Link>
                        </li>
                        <li className="py-8">
                            <Link href="/eventosPublicos" className="text-xl text-headertext hover:text-grayish">
                                Eventos Públicos
                            </Link>
                        </li>
                        <li className="py-8">
                            <Link href="/perfil" className="text-xl text-headertext hover:text-grayish">
                                Mi Perfil
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header >
    );
}
