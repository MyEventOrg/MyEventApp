"use client";

import { useEffect, useState } from "react";
import NoMainHeader from "../../components/NoMainHeader";
import { useUser } from "../../context/userContext";
import eventoCreadoApi, { EventoCreado } from "../../api/eventoCreado";
import EventoCreadoCard from "../../components/EventoCreadoCard";

export default function MisEventos() {
    const { user, loading: userLoading, isAuthenticated } = useUser();
    const [loading, setLoading] = useState(true);
    const [eventos, setEventos] = useState<EventoCreado[]>([]);
    const [filtro, setFiltro] = useState<"activo" | "vencido">("activo");

    useEffect(() => {
        if (userLoading) return;
        if (!isAuthenticated || !user?.usuario_id) {
            setLoading(false);
            return;
        }

        let activo = true;
        (async () => {
            try {
                const resp = await eventoCreadoApi.getEventosCreados(user.usuario_id);
                if (!activo) return;
                setEventos(resp.data.eventosCreados || []);
            } catch (err) {
                console.error("Error al cargar eventos creados", err);
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            activo = false;
        };
    }, [userLoading, isAuthenticated, user]);

    const eventosFiltrados = eventos
        .filter((ev) => ev.estado_evento === filtro)
        .sort((a, b) => new Date(a.fecha_evento).getTime() - new Date(b.fecha_evento).getTime());

    return (
        <>
            <NoMainHeader title="Mis Eventos" />
            <main className="px-12 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Mis Eventos</h2>
                    <div className="flex gap-4 text-sm font-medium">
                        <button
                            onClick={() => setFiltro("activo")}
                            className={`transition cursor-pointer ${filtro === "activo"
                                ? "text-gray-900 underline underline-offset-4"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            Activos
                        </button>
                        <span className="text-gray-400">/</span>
                        <button
                            onClick={() => setFiltro("vencido")}
                            className={`transition ${filtro === "vencido"
                                ? "text-gray-900 underline underline-offset-4"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            Vencidos
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p className="text-gray-600">Cargando eventos...</p>
                ) : eventosFiltrados.length === 0 ? (
                    <p className="text-gray-600">No tienes eventos {filtro}s.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {eventosFiltrados.map((evento) => (
                            <EventoCreadoCard key={evento.evento_id} evento={evento} />
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
