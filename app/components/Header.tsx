"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import UsuarioApi from "../api/usuario";
import UserMenuDropdown from "./UserDropDown";
import { useUser } from "../context/userContext";

export default function Header() {
    const { user, isAuthenticated } = useUser();
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
            await UsuarioApi.cerrarSesion();
        } catch (e) {
        } finally {
            router.push("/login");
        }
    };

    return (
        <header className="w-full bg-white text-white">
            <nav className="mx-auto relative flex items-center justify-between py-6 px-12 border-b-[1.5px] border-bordergray">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    <img
                        src="/logo.png"
                        alt="Notificaciones"
                        className="w-8 h-8"
                    />
                    <div className="font-bold text-primary text-3xl">
                        MyEvent
                    </div>
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
                                        src={user?.url_imagen || "/User.png"}
                                        alt="Usuario"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <p className="text-grayish text-xl">
                                        {user?.apodo}
                                    </p>
                                </>
                            ) : (
                                <>No has iniciado sesión</>
                            )}
                        </div>
                        <UserMenuDropdown
                            open={isDropdownOpen}
                            onLogout={handleLogout}
                        />
                    </li>

                    <li>
                        <img
                            src="/Doorbell.png"
                            alt="Notificaciones"
                            className="w-8 h-8"
                        />
                    </li>
                </ul>
            </nav>
            <div className="border-b-[1.5px] border-bordergray">
                <nav className="mx-auto flex items-center justify-between px-20">
                    <ul className="flex flex-wrap items-center gap-6">
                        <li
                            className={`py-4 ${pathname === "/" ? "border-b-2 border-primary" : ""
                                }`}
                        >
                            <Link
                                href="/"
                                className={`text-[1rem] text-headertext ${pathname === "/"
                                    ? "text-primary"
                                    : "hover:text-grayish"
                                    }`}
                            >
                                Resumen
                            </Link>
                        </li>
                        <li
                            className={`py-4 ${pathname === "/buscarEventos"
                                ? "border-b-2 border-primary"
                                : ""
                                }`}
                        >
                            <Link
                                href="/buscarEventos"
                                className={`text-[1rem] text-headertext ${pathname === "/buscarEventos"
                                    ? "text-primary"
                                    : "hover:text-grayish"
                                    }`}
                            >
                                Buscar Eventos
                            </Link>
                        </li>
                        <li
                            className={`py-4 ${pathname === "/eventosGuardados"
                                ? "border-b-2 border-primary"
                                : ""
                                }`}
                        >
                            <Link
                                href="/eventosGuardados"
                                className={`text-[1rem] text-headertext ${pathname === "/eventosGuardados"
                                    ? "text-primary"
                                    : "hover:text-grayish"
                                    }`}
                            >
                                Eventos Guardados
                            </Link>
                        </li>
                        <li
                            className={`py-4 ${pathname === "/misAsistencias"
                                ? "border-b-2 border-primary"
                                : ""
                                }`}
                        >
                            <Link
                                href="/misAsistencias"
                                className={`text-[1rem] text-headertext ${pathname === "/misAsistencias"
                                    ? "text-primary"
                                    : "hover:text-grayish"
                                    }`}
                            >
                                Mis Asistencias
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
