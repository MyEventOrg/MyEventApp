"use client";

import { useRouter } from "next/navigation";
import UsuarioApi from "../../api/usuario";
import { useUser } from "../../context/userContext";

export default function Header() {
    const { user, isAuthenticated } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await UsuarioApi.cerrarSesion();
        } catch (e) {
            console.error("Error al cerrar sesión", e);
        } finally {
            router.push("/login");
        }
    };

    return (
        <header className="w-full bg-white border-b border-gray-200 shadow-sm">
            <nav className="flex items-center justify-between px-8 py-3">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                    <span className="text-primary font-bold text-xl">MyEvent</span>
                    <span className="text-red-500 font-semibold">ADMIN</span>
                </div>

                <div className="flex items-center gap-6">
                    <img
                        src="/Doorbell.png"
                        alt="Notificaciones"
                        className="w-6 h-6 cursor-pointer"
                    />
                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-800 text-sm">
                                {user?.apodo}{" "}
                            </span>
                        </div>
                    ) : (
                        <span className="text-gray-500 text-sm">No has iniciado sesión</span>
                    )}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="text-sm cursor-pointer text-gray-600 hover:text-red-500 transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </nav>
        </header>
    );
}
