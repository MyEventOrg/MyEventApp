"use client";

import { useEffect, useState } from "react";
import NoMainHeader from "../../components/NoMainHeader";
import { useUser } from "../../context/userContext";
import eventoAsistidoApi, { EventoAsistido } from "../../api/eventoAsistido";
import EventCard from "../../components/EventCard";

export default function MisAsistencias() {
    const { user, loading: userLoading, isAuthenticated } = useUser();
    const [loading, setLoading] = useState(true);
    const [eventos, setEventos] = useState<EventoAsistido[]>([]);

    useEffect(() => {
        if (userLoading) return;
        if (!isAuthenticated || !user?.usuario_id) {
            setLoading(false);
            return;
        }

        let activo = true;
        (async () => {
            try {
                const resp = await eventoAsistidoApi.getEventosAsistidos(user.usuario_id);
                if (!activo) return;
                // 👇 Asegúrate de acceder a .eventosAsistiendo, no .eventosCreados
                setEventos(resp.data.eventosAsistiendo || []);
            } catch (error) {
                console.error("Error cargando eventos asistidos:", error);
            } finally {
                if (activo) setLoading(false);
            }
        })();

        return () => {
            activo = false;
        };
    }, [userLoading, isAuthenticated, user?.usuario_id]);

    return (
        <>
            <div className="flex justify-between mb-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Mis Asistencias a Eventos
                </h1>
                <span className="text-sm sm:text-base text-gray-600">
                    {eventos.length} en total
                </span>
            </div>

            {
                loading ? (
                    <p className="text-center text-gray-500">Cargando eventos...</p>
                ) : eventos.length === 0 ? (
                    <p className="text-center text-gray-500">No estás asistiendo a ningún evento.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {eventos.map((evento) => (
                            <EventCard
                                key={evento.evento_id}
                                event={{ ...evento, rol: "asistente" }}
                                isEventosAsistiendoPage={true}
                            />
                        ))}
                    </div>
                )
            }
        </>
    );
}
