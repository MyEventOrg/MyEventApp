"use client";

import { CalendarDays, Clock, MapPin as MapPinStroke, Users2, Heart } from "lucide-react";
import React, { useState } from "react";
import eventoGuardadoApi from "../api/eventoGuardado";
import invitacionApi from "../api/invitacion";
import Aviso from "./Aviso";
import Advice from "./Advice";
import { useRouter } from "next/navigation";
import { useUser } from "../context/userContext";

export type EventoBase = {
    evento_id: number;
    titulo: string;
    descripcion_corta: string;
    fecha_evento: string;
    hora: string | null;
    tipo_evento: string;
    ubicacion: string | null;
    ciudad?: string | null;
    distrito?: string | null;
    estado_evento?: string;
    url_direccion?: string | null;
    latitud?: string | number | null;
    longitud?: string | number | null;
    url_imagen?: string | null;
    asistentes?: number;
    guardado?: string | null;

};

export type EventoWithRol = EventoBase & { rol?: "organizador" | "asistente" | "asistenciapendiente" | "nada" | null };

function toDateLocal(fecha: string, hora?: string | null) {
    const [y, m, d] = fecha.split("-").map(Number);
    const [hh, mm] = (hora ?? "00:00").split(":").map((v) => Number(v || 0));
    return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
}

function getCoords(e: EventoBase): { lat: number; lng: number } | null {
    const lat = typeof e.latitud === "string" ? parseFloat(e.latitud) : e.latitud;
    const lng = typeof e.longitud === "string" ? parseFloat(e.longitud) : e.longitud;

    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat: lat!, lng: lng! };

    if (e.url_direccion) {
        try {
            const u = new URL(e.url_direccion);
            const q = u.searchParams.get("q");
            if (q) {
                const [la, lo] = q.split(",").map(Number);
                if (Number.isFinite(la) && Number.isFinite(lo)) return { lat: la, lng: lo };
            }
        } catch { }
    }
    return null;
}

function buildStaticMapUrl(e: EventoBase) {
    const coords = getCoords(e);
    const key = "AIzaSyDdTo8nhURFO9BsyUd0LtaOH9VR7dmCIwM";
    if (!coords || !key) return null;

    const { lat, lng } = coords;
    const params = new URLSearchParams({
        center: `${lat},${lng}`,
        zoom: "15",
        size: "640x160",
        scale: "2",
        maptype: "roadmap",
        key,
        markers: `color:red|label:%E2%80%A2|${lat},${lng}`,
    }).toString();

    return `https://maps.googleapis.com/maps/api/staticmap?${params}`;
}

export default function EventCardBuscar({
    event,
    className = "",
    showMap = true,
    isEventosAsistiendoPage = false,
    usuarioId, // 🔹 Nuevo prop opcional (por si más adelante quieres guardar/quitar guardado)
}: {
    event: EventoWithRol;
    className?: string;
    showMap?: boolean;
    isEventosAsistiendoPage?: boolean;
    usuarioId?: number;
}) {
    const e = event;
    const [liked, setLiked] = useState(e.guardado === "si"); // ✅ Estado inicial según "guardado"
    const [avisoVisible, setAvisoVisible] = useState(false);
    const [avisoMensaje, setAvisoMensaje] = useState("");
    const [avisoTipo, setAvisoTipo] = useState<"success" | "error">("success");
    const [adviceOpen, setAdviceOpen] = useState(false);
    const { user, loading: userLoading, isAuthenticated } = useUser();
    const [adviceJoinOpen, setAdviceJoinOpen] = useState(false);

    const router = useRouter();
    const toggleLike = () => {
        // Aquí más adelante puedes implementar el POST a guardar evento
        setLiked((prev) => !prev);
    };

    const mapUrl = showMap ? buildStaticMapUrl(e) : null;
    const coords = getCoords(e);
    const linkToMaps =
        e.url_direccion ||
        (coords ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}` : undefined);
    const placeLabel = e.ubicacion || e.ciudad || e.distrito || "Ver en Google Maps";

    const handleUnirse = async () => {
        if (!user?.usuario_id) return;

        const res = await invitacionApi.asistirEvento({
            evento_id: e.evento_id,
            usuario_id: user.usuario_id,
        });

        window.location.reload();
    };

    const renderRolButton = () => {
        if (e.rol === "organizador") {
            return (
                <span className="text-xs px-2 py-5 rounded-2xl bg-violet-100 text-violet-700 font-medium">
                    Organizador
                </span>
            );
        }
        if (e.rol === "asistenciapendiente") {
            return (
                <span className="text-xs px-2 flex items-center gap-1 py-5 rounded-2xl bg-yellow-100 text-yellow-700 font-medium">
                    <Clock />
                    Asistencia Pendiente
                </span>
            );
        }
        if (e.rol === "asistente") {
            return (
                <span className="text-xs px-2 py-5 rounded-2xl bg-cyan-500 text-white font-medium">
                    Asistencia Confirmada
                </span>
            );
        }
        return (
            <button
                onClick={() => setAdviceJoinOpen(true)}
                className="text-xs px-3 py-5 cursor-pointer rounded-2xl bg-green-500 text-white font-medium hover:bg-green-600 transition"
            >
                Unirse al Evento
            </button>
        );
    };
    const handleGuardarEvento = async () => {
        if (liked || !usuarioId) return;

        try {
            const res = await eventoGuardadoApi.guardarEvento(usuarioId, e.evento_id);

            if (res.success) {
                setLiked(true);
                setAvisoTipo("success");
                setAvisoMensaje("Evento guardado correctamente");
            } else {
                throw new Error(res.message);
            }
        } catch (error: any) {
            setAvisoTipo("error");
            setAvisoMensaje("Error al guardar el evento");
            console.error("Error al guardar evento:", error);
        } finally {
            setAvisoVisible(true);
            setTimeout(() => setAvisoVisible(false), 3000);
        }
    };
    // Eliminar evento (confirmado desde Advice)
    const handleEliminarEventoGuardado = async () => {
        if (!usuarioId) return;
        try {
            const res = await eventoGuardadoApi.eliminarEventoGuardado(usuarioId, e.evento_id);
            if (res.success) {
                setLiked(false);
                setAvisoTipo("success");
                setAvisoMensaje("Evento ya no guardado");
            } else {
                throw new Error(res.message);
            }
        } catch (error: any) {
            setAvisoTipo("error");
            setAvisoMensaje("Error al quitar evento guardado");
            console.error("Error al eliminar evento guardado:", error);
        } finally {
            setAvisoVisible(true);
            setTimeout(() => setAvisoVisible(false), 3000);
        }
    };

    // ✅ Control de clic en corazón
    const handleHeartClick = () => {
        if (liked) {
            setAdviceOpen(true); // abre popup antes de eliminar
        } else {
            handleGuardarEvento();
        }
    };
    return (
        <>
            <article
                className={`group w-full bg-white rounded-2xl border border-gray-200 shadow-[0_6px_16px_rgba(0,0,0,0.08)] 
            p-4 transition-transform duration-300 ${className}`}
            >
                {/* Header con título y corazón */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{e.titulo}</h3>
                    <button
                        onClick={handleHeartClick}
                        className="text-red-500 hover:text-red-600 transition cursor-pointer"
                        aria-label={liked ? "Quitar de guardados" : "Guardar evento"}
                    >
                        <Heart className={`w-5 h-5 ${liked ? "fill-red-500" : ""}`} />
                    </button>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">{e.descripcion_corta}</p>

                {/* Info del evento */}
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        <span>
                            {toDateLocal(e.fecha_evento).toLocaleDateString(undefined, {
                                weekday: "long", day: "2-digit", month: "long", year: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{e.hora ?? "00:00"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPinStroke className="w-4 h-4 text-gray-500" />
                        <span className="line-clamp-1">{placeLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users2 className="w-4 h-4 text-gray-500" />
                        <span>
                            {typeof e.asistentes !== "number" || e.asistentes <= 0
                                ? "No hay asistentes"
                                : `${e.asistentes} ${e.asistentes === 1 ? "asistente" : "asistentes"}`}
                        </span>
                    </div>
                </div>

                {/* Mapa */}
                {showMap && (
                    mapUrl && e.url_direccion ? (
                        <a
                            href={e.url_direccion}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-3"
                        >
                            <div className="relative w-full h-[120px] rounded-xl overflow-hidden border shadow-sm">
                                <img
                                    src={mapUrl}
                                    alt={`Ubicación de ${e.ubicacion || "evento"}`}
                                    className="w-full h-full object-cover pointer-events-none select-none"
                                    draggable={false}
                                />

                                {e.ubicacion && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white/95 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 truncate">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="#ef4444"
                                                className="w-3.5 h-3.5"
                                            >
                                                <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                                            </svg>
                                            <span className="truncate max-w-[90%]">{e.ubicacion}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </a>
                    ) : (
                        <div className="mt-3 w-full h-[120px] rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                            Sin ubicación
                        </div>
                    )
                )}

                {/* Footer */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    {/* Tipo */}
                    <span className={`text-xs px-2 py-5 rounded-2xl font-medium 
                    ${e.tipo_evento === "publico" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        Evento {e.tipo_evento === "publico" ? "Público" : "Privado"}
                    </span>

                    {renderRolButton()}

                    <button
                        onClick={() => router.push(`/evento/${e.evento_id}`)}
                        className="text-xs px-3 py-5 bg-sky-700 text-white rounded-2xl cursor-pointer font-medium hover:bg-sky-800 transition"
                    >
                        Ver Detalles
                    </button>
                </div>

                {isEventosAsistiendoPage && e.estado_evento === "vencido" && (
                    <div className="mt-3 text-sm text-red-600 font-medium">
                        <span>El evento ha vencido</span>
                    </div>
                )}
            </article>
            {/* Aviso animado */}
            <Aviso mensaje={avisoMensaje} visible={avisoVisible} tipo={avisoTipo} />

            {/* Advice para confirmar eliminación */}
            <Advice
                isOpen={adviceOpen}
                message="¿Seguro que ya no quieres guardar este evento?"
                onConfirm={handleEliminarEventoGuardado}
                onClose={() => setAdviceOpen(false)}
            />

            <Advice
                isOpen={adviceJoinOpen}
                message="¿Seguro que quieres unirte al evento?"
                onConfirm={handleUnirse}
                onClose={() => setAdviceJoinOpen(false)}
            />
        </>
    );
}
