"use client";

import { useEffect, useState } from "react";
import EventoApi from "../../api/evento";
import EventoModal from "./eventoModal";
import EventoGestionModal from "./eventoGestionModal";

export interface Evento {
    evento_id: number;
    titulo: string;
    descripcion_corta: string;
    descripcion_larga: string;
    fecha_evento: string;
    fecha_creacion_evento: string;
    hora: string;
    url_imagen: string;
    tipo_evento: string;
    ubicacion: string;
    latitud: string;
    longitud: string;
    ciudad: string;
    distrito: string;
    url_direccion: string;
    url_recurso: string;
    estado_evento: string;
    categoria_id: number;

    organizador?: {
        usuario_id: number;
        nombreCompleto: string;
        correo: string;
        apodo: string;
    } | null;
    categoria?: {
        categoria_id: number;
        nombre: string;
    } | null;
}

interface EventosTableProps {
    title: string;
    tipo: "publicos" | "privados";
}

export default function EventosTable({ title, tipo }: EventosTableProps) {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGestionModalOpen, setIsGestionModalOpen] = useState(false);

    const handleVerDetalle = (evento: Evento) => {
        setSelectedEvento(evento);
        setIsModalOpen(true);
    };

    const fetchEventos = async (p: number) => {
        setLoading(true);
        const res =
            tipo === "publicos"
                ? await EventoApi.getEventosPublicos(p)
                : await EventoApi.getEventosPrivados(p);

        if (res && res.data) {
            setEventos(res.data);
            setPage(res.page);
            setTotalPages(res.totalPages);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEventos(1);
    }, []);

    return (
        <>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-[#3F78A1]">{title}</h1>
                    <div className="flex items-center justify-between gap-4">
                        <button
                            disabled={page <= 1}
                            onClick={() => fetchEventos(page - 1)}
                            className={`px-4 py-2 rounded-md text-white ${page <= 1
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-[#3F78A1] hover:bg-[#356688]"
                                }`}
                        >
                            Anterior
                        </button>

                        <span className="text-gray-700 font-medium">
                            Página {page} de {totalPages}
                        </span>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => fetchEventos(page + 1)}
                            className={`px-4 py-2 rounded-md text-white ${page >= totalPages
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-[#3F78A1] hover:bg-[#356688]"
                                }`}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>

                <div className="rounded-lg shadow-md border border-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-auto">
                    <table className="w-full table-fixed bg-white text-sm [&_th]:align-middle [&_td]:align-middle">
                        <thead className="bg-[#3F78A1] text-white sticky top-0 z-10">
                            <tr className="[&_th]:text-center">
                                <th className="px-2 py-2 w-[50px]">#</th>
                                <th className="px-2 py-2 w-[180px]">Acciones</th>
                                <th className="px-2 py-2 w-[200px]">Título</th>
                                <th className="px-2 py-2 w-[300px]">Descripción corta</th>
                                <th className="px-2 py-2 w-[150px]">Fecha creación</th>
                                <th className="px-2 py-2 w-[150px]">Fecha evento</th>
                                <th className="px-2 py-2 w-[250px]">Ubicación</th>
                                <th className="px-2 py-2 w-[150px]">Ciudad</th>
                                <th className="px-2 py-2 w-[150px]">Distrito</th>
                                <th className="px-2 py-2 w-[200px]">Creado por</th>
                                <th className="px-2 py-2 w-[150px]">Estado</th>
                                <th className="px-2 py-2 w-[150px]">Categoría</th>
                            </tr>
                        </thead>

                        <tbody className="[&_td]:text-left">
                            {loading ? (
                                <tr>
                                    <td colSpan={12} className="text-start py-4 text-gray-500">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : eventos.length > 0 ? (
                                eventos.map((evento, index) => (
                                    <tr
                                        key={evento.evento_id}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="px-2 py-2">{(page - 1) * 10 + index + 1}</td>

                                        <td className="px-2 py-2">
                                            <div className="flex gap-2 justify-center items-center h-full">
                                                <button
                                                    disabled={evento.estado_evento === "vencido"}
                                                    onClick={() => {
                                                        setSelectedEvento(evento);
                                                        setIsGestionModalOpen(true);
                                                    }}
                                                    className={`px-4 py-3 text-xs text-white rounded transition ${evento.estado_evento === "vencido"
                                                        ? "bg-gray-300 cursor-not-allowed"
                                                        : "bg-[#3F78A1] hover:bg-[#356688]"
                                                        }`}
                                                >
                                                    Gestionar
                                                </button>
                                                <button
                                                    onClick={() => handleVerDetalle(evento)}
                                                    className="px-4 py-3 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                                                >
                                                    Ver más detalle
                                                </button>
                                            </div>
                                        </td>

                                        <td className="px-2 py-2 font-medium">{evento.titulo}</td>
                                        <td className="px-2 py-2 break-words">{evento.descripcion_corta}</td>
                                        <td className="px-2 py-2">
                                            {new Date(evento.fecha_creacion_evento).toLocaleDateString()}
                                        </td>
                                        <td className="px-2 py-2">
                                            {new Date(evento.fecha_evento).toLocaleDateString()}
                                        </td>
                                        <td className="px-2 py-2 break-words">{evento.ubicacion}</td>
                                        <td className="px-2 py-2">{evento.ciudad}</td>
                                        <td className="px-2 py-2">{evento.distrito}</td>
                                        <td className="px-2 py-2">{evento.organizador?.correo ?? "-"}</td>
                                        <td className="px-2 py-2">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-semibold ${evento.estado_evento === "pendiente"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : evento.estado_evento === "activo"
                                                        ? "bg-green-100 text-green-700"
                                                        : evento.estado_evento === "rechazado"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-gray-200 text-gray-600"
                                                    }`}
                                            >
                                                {evento.estado_evento}
                                            </span>
                                        </td>
                                        <td className="px-2 py-2">{evento.categoria?.nombre ?? "-"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={12} className="text-center py-4 text-gray-500">
                                        No hay eventos
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            <EventoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                evento={selectedEvento}
            />

            <EventoGestionModal
                isOpen={isGestionModalOpen}
                onClose={() => setIsGestionModalOpen(false)}
                evento={selectedEvento}
                onAfterUpdate={() => fetchEventos(page)}
            />
        </>
    );
}
