"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/eventosPublicos", label: "Eventos Públicos" },
        { href: "/eventosPrivados", label: "Eventos Privados" },
        { href: "/gestionUsuarios", label: "Gestión de Usuarios" },
    ];

    return (
        <aside className="h-full bg-gray-100 border-r border-gray-300 p-4 overflow-y-auto">
            <nav className="flex flex-col space-y-1">
                {links.map(({ href, label }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`px-3 py-2 rounded-lg font-medium transition-colors
                ${active
                                    ? "bg-blue-100 text-blue-700 border-r-3 border-b-3 border-blue-500"
                                    : "text-gray-700 hover:bg-gray-200 hover:text-blue-600"
                                }`}
                        >
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
