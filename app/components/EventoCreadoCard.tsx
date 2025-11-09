"use client";

import { EventoCreado } from "../api/eventoCreado";
import { Calendar, MapPin, Users, Pencil, Eye, PersonStanding, Hourglass, Timer } from "lucide-react";
import Link from "next/link";

interface Props {
    evento: EventoCreado;
}

export default function EventoCreadoCard({ evento }: Props) {
    const {
        evento_id,
        titulo,
        descripcion_corta,
        fecha_evento,
        hora,
        ubicacion,
        url_imagen,
        estado_evento,
        tipo_evento,
        asistentes,
    } = evento;

    return (
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4 border border-gray-200">
            <div className="flex justify-between items-start min--f">
                <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {titulo}
                </h2>
                <div className="flex items-center gap-2">
                    <Link href={`/eventos/${evento_id}`}>
                        <Eye className="w-4 h-4 text-green-500 hover:text-green-700 cursor-pointer" />
                    </Link>
                </div>
            </div>

            <p className="text-sm text-gray-700 line-clamp-2">
                {descripcion_corta}
            </p>
            <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(fecha_evento).toLocaleDateString("es-PE", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Timer className="w-4 h-4" />
                    <span>{hora}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <PersonStanding className="w-4 h-4" />
                    <span>{asistentes}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{ubicacion}</span>
                </div>
            </div>
            <div className="flex flex-wrap  justify-end items-center gap-2 text-sm">
                <span className={`px-4 py-2 rounded-full font-semibold ${estado_evento === "activo"
                    ? "bg-green-400 text-white"
                    : "bg-gray-300 text-gray-700"}`}
                >
                    {estado_evento.charAt(0).toUpperCase() + estado_evento.slice(1)}
                </span>
                <span className={`px-4 py-2 rounded-full font-semibold text-gray-700 ${tipo_evento === "publico"
                    ? "bg-green-200"
                    : "bg-gray-300"}`}
                >
                    {tipo_evento.charAt(0).toUpperCase() + tipo_evento.slice(1)}
                </span>
                <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium">
                    Organizador
                </span>
            </div>
        </div >
    );
}
