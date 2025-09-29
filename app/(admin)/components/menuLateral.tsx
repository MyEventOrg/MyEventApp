"use client";
import Link from "next/link";

export default function Lateral() {
    return (
        <aside className="h-full bg-gray-100 border-r border-gray-300 p-4 overflow-y-auto">
            <nav className="flex flex-col space-y-4">
                <Link href="/eventosPublicos" className="font-semibold hover:text-blue-500">Eventos Públicos</Link>
                <Link href="/eventosPrivados" className="font-semibold hover:text-blue-500">Eventos Privados</Link>
                <Link href="/gestionUsuarios" className="font-semibold hover:text-blue-500">Gestión de Usuarios</Link>
            </nav>
        </aside>
    );
}
