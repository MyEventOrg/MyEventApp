"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import UsuarioApi from "../../api/usuario";
import UserMenuDropdown from "./home_components/UserDropDown";
import { useUser } from "../../context/userContext";

export default function Header() {
    const { user, isAuthenticated, loading } = useUser();

    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();
    const dropdownRef = useRef<HTMLLIElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const handleLogout = async () => {
        setIsDropdownOpen(false);
        try {
            const resp = await UsuarioApi.cerrarSesion();
        } catch (e) {
        } finally {
            router.push("/login");
        }
    };
    return (
        <header className="w-full bg-white text-white">
            <nav className="mx-auto relative flex items-center justify-between py-6 px-12 border-b-[1.5px] border-bordergray">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
                    <img
                        src="/logo.png"
                        alt="Notificaciones"
                        className="w-8 h-8"
                    />
                    <div className="font-bold text-primary text-3xl">MyEvent</div>
                </div>
                <ul className="flex flex-wrap items-center gap-6">
                    <button
                        onClick={() => router.push("/crearEvento")}
                        className="flex cursor-pointer items-center gap-2 bg-[#39739d] text-white px-5 py-2 rounded-[20px] shadow hover:bg-[#2e5c7e] transition"
                    >
                        <span className="text-2xl font-bold">+</span>
                        <span>Crear Evento</span>
                    </button>
                    <li className="relative" ref={dropdownRef}>
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {isAuthenticated ? (
                                <>
                                    <img
                                        src="/User.png"
                                        alt="Usuario"
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <p className="text-grayish text-xl">{user?.apodo}</p>
                                </>
                            ) : (
                                <>No has iniciado sesión</>
                            )}
                        </div>
                        <UserMenuDropdown open={isDropdownOpen} onLogout={handleLogout} />
                    </li>

                    <li>
                        <img
                            src="/Doorbell.png"
                            alt="Notificaciones"
                            className="w-8 h-8"
                        />
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
                        <li className={`py-4 ${pathname === "/" ? "border-b-2 border-primary" : ""}`}>
                            <Link href="/" className={`text-[1rem] text-headertext ${pathname === "/" ? "text-primary" : "hover:text-grayish"}`}>
                                Resumen
                            </Link>
                        </li>
                        <li className={`py-4 ${pathname === "/buscarEventos" ? "border-b-2 border-primary" : ""}`}>
                            <Link href="/buscarEventos" className={`text-[1rem] text-headertext ${pathname === "/buscarEventos" ? "text-primary" : "hover:text-grayish"}`}>
                                Buscar Eventos
                            </Link>
                        </li>
                        <li className={`py-4 ${pathname === "/eventosGuardados" ? "border-b-2 border-primary" : ""}`}>
                            <Link href="/eventosGuardados" className={`text-[1rem] text-headertext ${pathname === "/eventosGuardados" ? "text-primary" : "hover:text-grayish"}`}>
                                Eventos Guardados
                            </Link>
                        </li>
                        <li className={`py-4 ${pathname === "/eventosAsistidos" ? "border-b-2 border-primary" : ""}`}>
                            <Link href="/eventosAsistidos" className={`text-[1rem] text-headertext ${pathname === "/eventosAsistidos" ? "text-primary" : "hover:text-grayish"}`}>
                                Eventos a los que asistió
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header >
    );
}
