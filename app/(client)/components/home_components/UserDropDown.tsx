"use client";

import Link from "next/link";

type Props = {
    open: boolean;
    onLogout: () => void;
};

export default function UserMenuDropdown({ open, onLogout }: Props) {
    return (
        <div
            className={`absolute -right-8 mt-2 w-48 bg-white rounded-lg shadow z-50 transition-all duration-300 ease-in-out overflow-hidden ${open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                }`}
        >
            <ul className="flex flex-col text-left">
                <li>
                    <Link
                        href="/perfil"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                        Ver Perfil
                    </Link>
                </li>

                <li>
                    <Link
                        href="/misEventos"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                        Mis Eventos
                    </Link>
                </li>
                <li className="border-t border-gray-200 mt-12">
                    <button
                        type="button"
                        onClick={onLogout}
                        className="block cursor-pointer w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                        Cerrar Sesión
                    </button>
                </li>
            </ul>
        </div>
    );
}
