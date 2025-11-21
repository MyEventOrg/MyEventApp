"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import UsuarioApi from "../api/usuario";
import NotificacionApi from "../api/notificacion";
import Notificaciones from "./notificaciones";
import UserMenuDropdown from "./UserDropDown";
import { useUser } from "../context/userContext";

type NotificacionApiType = {
    notificacion_id: number;
    evento_id: number;
    mensaje: string;
    fecha_creacion: string;
    visto: boolean;
};

export default function Header() {
    const { user, isAuthenticated } = useUser();
    const pathname = usePathname();
    const router = useRouter();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notificaciones, setNotificaciones] = useState<NotificacionApiType[]>([]);

    const unreadCount = notificaciones.filter(n => !n.visto).length;

    const dropdownRef = useRef<HTMLLIElement>(null);
    const notificationRef = useRef<HTMLLIElement>(null);

    // ----------------------------------------------------
    // 🔄 Función reutilizable para cargar notificaciones
    // ----------------------------------------------------
    const loadNotificaciones = useCallback(async () => {
        if (!user?.usuario_id) return;

        try {
            console.log("📨 Cargando notificaciones desde API...");
            const res = await NotificacionApi.getNotificaciones(user.usuario_id);
            if (res.ok) {
                setNotificaciones(res.notificaciones);
            }
        } catch (error) {
            console.error("Error cargando notificaciones", error);
        }
    }, [user?.usuario_id]);

    // ----------------------------------------------------
    // 1️⃣ Cargar al iniciar / cuando cambia el usuario
    // ----------------------------------------------------
    useEffect(() => {
        if (!user?.usuario_id) return;
        loadNotificaciones();
    }, [user?.usuario_id, loadNotificaciones]);

    // ----------------------------------------------------
    // 2️⃣ Recargar cuando se abre o se cierra el panel
    // ----------------------------------------------------
    useEffect(() => {
        if (!user?.usuario_id) return;

        // Si quieres que recargue SOLO al abrir:
        // if (isNotificationOpen) {
        //     loadNotificaciones();
        // }

        // Si quieres que recargue tanto al abrir como al cerrar:
        loadNotificaciones();
    }, [isNotificationOpen, user?.usuario_id, loadNotificaciones]);

    // ----------------------------------------------------
    // 3️⃣ POLLING cada 10 segundos
    // ----------------------------------------------------
    useEffect(() => {
        if (!user?.usuario_id) return;

        const interval = setInterval(() => {
            loadNotificaciones();
        }, 10000); // 10s (ajusta si quieres 1 min, etc)

        return () => clearInterval(interval);
    }, [user?.usuario_id, loadNotificaciones]);

    // ----------------------------------------------------
    // Click fuera para cerrar
    // ----------------------------------------------------
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setIsDropdownOpen(false);
            }

            if (notificationRef.current && !notificationRef.current.contains(target)) {
                setIsNotificationOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ----------------------------------------------------
    // Marcar como vista
    // ----------------------------------------------------
    const handleNotificacionClick = async (notificacion_id: number) => {
        setNotificaciones(prev =>
            prev.map(n =>
                n.notificacion_id === notificacion_id
                    ? { ...n, visto: true }
                    : n
            )
        );

        await NotificacionApi.notificacionVista(notificacion_id);
    };

    const openNotifications = () => {
        setIsNotificationOpen(prev => !prev);
    };

    // ----------------------------------------------------
    // Logout
    // ----------------------------------------------------
    const handleLogout = async () => {
        setIsDropdownOpen(false);
        try {
            await UsuarioApi.cerrarSesion();
        } catch (e) {
            console.error("Error cerrando sesión", e);
        } finally {
            router.push("/login");
        }
    };

    // ----------------------------------------------------
    // RENDER
    // ----------------------------------------------------
    return (
        <header className="w-full bg-white text-white">
            <nav className="mx-auto relative flex items-center justify-between py-6 px-12 border-b-[1.5px] border-bordergray">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    <img src="/logo.png" alt="Logo" className="w-8 h-8" />
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

                    {/* USER DROPDOWN */}
                    <li className="relative" ref={dropdownRef}>
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsDropdownOpen(prev => !prev)}
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

                    {/* NOTIFICACIONES */}
                    <li className="relative" ref={notificationRef}>
                        <div className="relative cursor-pointer" onClick={openNotifications}>
                            <img
                                src="/Doorbell.png"
                                alt="Notificaciones"
                                className="w-8 h-8"
                            />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white px-2 py-[2px] rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <Notificaciones
                            open={isNotificationOpen}
                            notificaciones={notificaciones}
                            onClickNotificacion={handleNotificacionClick}
                            usuario_id={user?.usuario_id || 0}
                            onRefresh={loadNotificaciones}
                        />
                    </li>
                </ul>
            </nav>

            {/* PESTAÑAS */}
            <div className="border-b-[1.5px] border-bordergray">
                <nav className="mx-auto flex items-center justify-between px-20">
                    <ul className="flex flex-wrap items-center gap-6">

                        <li
                            className={`py-4 ${pathname === "/" ? "border-b-2 border-primary" : ""}`}
                        >
                            <Link
                                href="/"
                                className={`text-[1rem] text-headertext ${pathname === "/" ? "text-primary" : "hover:text-grayish"}`}
                            >
                                Resumen
                            </Link>
                        </li>

                        <li
                            className={`py-4 ${pathname === "/buscarEventos" ? "border-b-2 border-primary" : ""}`}
                        >
                            <Link
                                href="/buscarEventos"
                                className={`text-[1rem] text-headertext ${pathname === "/buscarEventos" ? "text-primary" : "hover:text-grayish"}`}
                            >
                                Buscar Eventos
                            </Link>
                        </li>

                        <li
                            className={`py-4 ${pathname === "/eventosGuardados" ? "border-b-2 border-primary" : ""}`}
                        >
                            <Link
                                href="/eventosGuardados"
                                className={`text-[1rem] text-headertext ${pathname === "/eventosGuardados" ? "text-primary" : "hover:text-grayish"}`}
                            >
                                Eventos Guardados
                            </Link>
                        </li>

                        <li
                            className={`py-4 ${pathname === "/misAsistencias" ? "border-b-2 border-primary" : ""}`}
                        >
                            <Link
                                href="/misAsistencias"
                                className={`text-[1rem] text-headertext ${pathname === "/misAsistencias" ? "text-primary" : "hover:text-grayish"}`}
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
