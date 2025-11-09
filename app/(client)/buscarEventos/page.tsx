"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import categoriaApi from "../../api/categoria";
import { useUser } from "../../context/userContext";
import eventoApi from "../../api/evento";
import EventCardBuscar, { EventoWithRol } from "./../../components/EventCardBuscar";

export default function BuscarEventos() {
    const [busqueda, setBusqueda] = useState("");
    const [categoria, setCategoria] = useState("Todas las categorías");
    const [tipo, setTipo] = useState("Todos");
    const [categoriasDisponibles, setCategoriasDisponibles] = useState<string[]>([]);
    const { user, loading: userLoading, isAuthenticated } = useUser();
    const [eventos, setEventos] = useState<EventoWithRol[]>([]);
    const [total, setTotal] = useState(0);

    const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value);
    };

    // Cargar categorías al inicio
    useEffect(() => {
        (async () => {
            try {
                const { data } = await categoriaApi.getCategorias();
                const nombres = Array.isArray(data)
                    ? data.map((cat: any) => cat.nombre ?? cat)
                    : [];
                setCategoriasDisponibles(["Todas las categorías", ...nombres]);
            } catch (error) {
                console.error("Error al cargar categorías:", error);
            }
        })();
    }, []);

    // Buscar eventos cuando los filtros cambian y el usuario esté listo
    useEffect(() => {
        const fetchEventos = async () => {
            if (userLoading) return;
            if (!isAuthenticated || !user?.usuario_id) return;

            try {
                const res = await eventoApi.eventosFiltrados(
                    busqueda,
                    tipo,
                    categoria,
                    user.usuario_id // ✅ se pasa como parte de la URL
                );
                setEventos(res.data);
                setTotal(res.total);
            } catch (error) {
                console.error("Error al obtener eventos filtrados:", error);
            }
        };

        fetchEventos();
    }, [busqueda, tipo, categoria, userLoading, isAuthenticated, user?.usuario_id]);

    return (
        <>
            <h1 className="text-xl font-semibold text-gray-900 mb-4">Buscar Eventos</h1>

            <div className="group w-full flex flex-wrap items-center gap-3 px-4 py-7 border border-gray-200 rounded-2xl bg-white shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition-transform duration-300 cursor-pointer">
                {/* Input de búsqueda */}
                <div className="relative w-full sm:w-2xl">
                    <Search className="absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por título o descripción"
                        value={busqueda}
                        onChange={handleBusquedaChange}
                        className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Select categoría */}
                <div className="relative">
                    <select
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        className="w-full px-3 py-2 cursor-pointer text-sm border rounded-md border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {categoriasDisponibles.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Select tipo */}
                <div className="relative">
                    <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className="w-full px-3 py-2 cursor-pointer text-sm border rounded-md border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Todos">Todos los estados</option>
                        <option value="publico">Públicos</option>
                        <option value="privado">Privados</option>
                    </select>
                </div>

                {/* Total eventos */}
                <div className="text-sm text-gray-600 ml-auto">
                    {total} evento{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
                </div>
            </div>

            {/* Grilla de resultados */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventos.map((evento) => (
                    <EventCardBuscar key={evento.evento_id} event={evento} usuarioId={user?.usuario_id} />
                ))}
            </div>
        </>
    );
}
