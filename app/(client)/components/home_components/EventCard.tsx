"use client";

import { CalendarDays, Clock, MapPin as MapPinStroke, Users2, Eye } from "lucide-react";
import React from "react";

export type EventoBase = {
    evento_id: number;
    titulo: string;
    descripcion_corta: string;
    fecha_evento: string;     // "YYYY-MM-DD"
    hora: string | null;      // "HH:mm" | null
    tipo_evento: string;
    ubicacion: string | null;
    ciudad?: string | null;
    distrito?: string | null;
    estado_evento?: string;
    url_direccion?: string | null;
    latitud?: string | number | null;
    longitud?: string | number | null;
    url_imagen?: string | null;
};

export type EventoWithRol = EventoBase & { rol: "organizador" | "asistente" };

function toDateLocal(fecha: string, hora?: string | null) {
    const [y, m, d] = fecha.split("-").map(Number);
    const [hh, mm] = (hora ?? "00:00").split(":").map((v) => Number(v || 0));
    return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
}

function getCoords(e: EventoBase): { lat: number; lng: number } | null {
    const lat =
        typeof e.latitud === "string" ? parseFloat(e.latitud) :
            typeof e.latitud === "number" ? e.latitud : null;
    const lng =
        typeof e.longitud === "string" ? parseFloat(e.longitud) :
            typeof e.longitud === "number" ? e.longitud : null;

    if (Number.isFinite(lat as number) && Number.isFinite(lng as number)) return { lat: lat!, lng: lng! };

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
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!coords || !key) return null;
    const { lat, lng } = coords;
    const params = new URLSearchParams({
        center: `${lat},${lng}`,
        zoom: "15",
        size: "640x160",
        scale: "2",
        maptype: "roadmap",
        key,
    }).toString();
    const markers = `&markers=color:red%7C${lat},${lng}`;
    return `https://maps.googleapis.com/maps/api/staticmap?${params}${markers}`;
}

/** Pin rojo relleno (SVG propio para que se vea como en el mock) */
function MarkerIcon({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            aria-hidden="true"
        >
            <path
                d="M12 2C7.86 2 4.5 5.22 4.5 9.3c0 4.9 6.35 11.76 7.2 12.64.16.17.45.17.61 0 .85-.88 7.19-7.74 7.19-12.64C19.5 5.22 16.14 2 12 2z"
                fill="#ef4444"
            />
            <circle cx="12" cy="9.5" r="3" fill="#ffffff" />
        </svg>
    );
}

export default function EventCard({
    event,
    className = "",
    showMap = true,
}: {
    event: EventoWithRol;
    className?: string;
    showMap?: boolean;
}) {
    const e = event;
    const mapUrl = showMap ? buildStaticMapUrl(e) : null;
    const coords = getCoords(e);
    const linkToMaps =
        e.url_direccion ||
        (coords ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}` : undefined);
    const placeLabel = e.ubicacion || e.ciudad || e.distrito || "Ver en Google Maps";

    return (
        <article className={`w-full bg-white rounded-2xl border border-gray-200 shadow-[0_6px_16px_rgba(0,0,0,0.08)] p-4 ${className}`}>
            <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{e.titulo}</h3>
                <Eye className="w-4 h-4 text-gray-400" />
            </div>

            <p className="text-sm text-gray-600 mt-1 line-clamp-3">{e.descripcion_corta}</p>
            <div className="mt-3 space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    <span>
                        {toDateLocal(e.fecha_evento).toLocaleDateString(undefined, {
                            weekday: "long",
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{e.hora ?? "00:00"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPinStroke className="w-4 h-4 text-gray-500" />
                    <span className="line-clamp-1">
                        {placeLabel}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Users2 className="w-4 h-4 text-gray-500" />
                    <span className="capitalize">{e.rol}</span>
                </div>
            </div>

            {showMap && (
                linkToMaps ? (
                    <a href={linkToMaps} target="_blank" rel="noopener noreferrer" className="block mt-3">
                        <div className="relative w-full h-[140px] rounded-xl overflow-hidden">
                            {mapUrl ? (
                                <img
                                    src={mapUrl}
                                    alt={`Ubicación de ${e.titulo}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100" />
                            )}

                            <div className="pointer-events-none px-3 pb-3 pt-0 absolute inset-x-3 bottom-0">
                                <div className="inline-flex max-w-full items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-md">
                                    <MarkerIcon className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-xs md:text-sm font-medium text-gray-800 truncate">{placeLabel}</span>
                                </div>
                            </div>
                        </div>
                    </a>
                ) : (
                    <div className="mt-3 w-full h-[140px] rounded-xl bg-gray-100" />
                )
            )}

            <div className="mt-3 flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${e.tipo_evento === "publico" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {e.tipo_evento === "publico" ? "Público" : "Privado"}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${e.rol === "organizador" ? "bg-violet-100 text-violet-700" : "bg-amber-100 text-amber-700"}`}>
                    {e.rol === "organizador" ? "Organizador" : "Asistente"}
                </span>
            </div>
        </article>
    );
}
