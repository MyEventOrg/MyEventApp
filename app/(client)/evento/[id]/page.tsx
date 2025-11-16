"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import eventoApi from "../../../api/evento";
import { CalendarDays, Clock, MapPin, Users2 } from "lucide-react";
import { useUser } from "../../../context/userContext";
import asistenciaApi from "../../../api/invitacion";
import AdviceSimple from "../../../components/AdviceSimple";
import Advice from "../../../components/Advice";


// Representa el organizador del evento
export interface Organizador {
    usuario_id: number;
    nombreCompleto: string;
    correo: string;
    apodo: string;
}

// Representa la categoría del evento
export interface Categoria {
    categoria_id: number;
    nombre: string;
}

// Representa la estructura principal de un evento
export interface EventoWithExtras {
    evento_id: number;
    titulo: string;
    descripcion_corta: string;
    descripcion_larga?: string;
    fecha_evento: string;
    fecha_creacion_evento?: string;
    hora: string | null;
    url_imagen?: string | null;
    tipo_evento: "publico" | "privado";
    ubicacion?: string | null;
    latitud?: string | null;
    longitud?: string | null;
    ciudad?: string | null;
    distrito?: string | null;
    url_direccion?: string | null;
    url_recurso?: string | null;
    estado_evento: "activo" | "vencido";
    categoria_id?: number;
    organizador?: Organizador | null;
    categoria?: Categoria | null;
    asistentes: number;

    // Propiedades opcionales del frontend
    // Por:
    asistentes_list?: {
        nombre: string;
        correo: string;
        url_imagen: string | null;
    }[];
    foro?: { usuario: string; texto: string }[];
}
function buildStaticMapUrl(lat: string | null | undefined, lng: string | null | undefined): string | null {
    const key = "AIzaSyDdTo8nhURFO9BsyUd0LtaOH9VR7dmCIwM";
    if (!lat || !lng) return null;
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
export default function DetalleEventoPage() {
    const { id } = useParams();
    const router = useRouter();
    const [evento, setEvento] = useState<EventoWithExtras | null>(null);
    const [loading, setLoading] = useState(true);
    const { user, loading: userLoading, isAuthenticated } = useUser();
    const [rol, setRol] = useState<"organizador" | "asistenciapendiente" | "asistente" | "nada">("nada");
    const [adviceOpen, setAdviceOpen] = useState(false);
    const [adviceMessage, setAdviceMessage] = useState("");
    const [cancelAdviceOpen, setCancelAdviceOpen] = useState(false);

    const handleCancelarAsistencia = async () => {
        if (!user?.usuario_id) return;

        const res = await asistenciaApi.anularAsistencia({
            evento_id: Number(id),
            usuario_id: user.usuario_id,
        });

        setAdviceMessage(res.message);
        setAdviceOpen(true); // mostramos el mensaje final

        // reload después de cerrar el modal (ya lo tienes abajo)
    };

    const handleUnirse = async () => {
        if (!user?.usuario_id) return;

        const res = await asistenciaApi.asistirEvento({
            evento_id: Number(id),
            usuario_id: user.usuario_id,
        });

        setAdviceMessage(res.message);
        setAdviceOpen(true);  // solo mostrar modal
    };


    useEffect(() => {
        if (userLoading) return;

        if (!isAuthenticated || !user?.usuario_id) {
            setLoading(false);
            return;
        }

        if (!id) return;

        (async () => {
            const res = await eventoApi.getEventoById(Number(id), user.usuario_id);
            if (res.success) {
                setEvento(res.data);
                setRol(res.data.rol);

            } else {
                console.error("Error al cargar evento:", res.message);
            }
            setLoading(false);
        })();
    }, [id, user, userLoading]);


    if (loading) {
        return <p className="p-12 text-gray-500 text-center">Cargando evento...</p>;
    }

    if (!evento) {
        return <p className="p-12 text-red-500 text-center">Evento no encontrado.</p>;
    }
    const mapUrl = buildStaticMapUrl(evento.latitud, evento.longitud);
    const linkToMaps = evento.url_direccion || (evento.latitud && evento.longitud ? `https://www.google.com/maps?q=${evento.latitud},${evento.longitud}` : undefined);
    return (
        <main className="min-h-screen bg-[#F5F5F5]">
            {/* Header */}
            <header className="w-full mx-auto py-8 px-12 bg-white border-b-[1.5px] border-bordergray flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <img
                        src="/Arrow Pointing Left.svg"
                        alt="Volver"
                        className="w-9 cursor-pointer"
                        onClick={() => router.back()}
                    />
                    <div className="font-bold text-black text-3xl">{evento.titulo}</div>
                </div>
                {rol === "asistenciapendiente" && (
                    <button className="bg-yellow-400 flex gap-2 text-white font-bold py-2 px-6 rounded-xl transition-all">
                        <Clock />
                        Asistencia pendiente
                    </button>
                )}


                {rol === "nada" && (
                    <button
                        className="bg-lime-400 cursor-pointer hover:bg-lime-500 text-white font-bold py-2 px-6 rounded-xl transition-all"
                        onClick={handleUnirse}
                    >
                        Unirse al evento
                    </button>
                )}


                {rol === "asistente" && (
                    <button onClick={() => setCancelAdviceOpen(true)} className="bg-red-500 cursor-pointer hover:bg-red-600 text-white font-bold py-2 px-6 rounded-xl transition-all">
                        Anular inscripción
                    </button>
                )}

            </header>

            {/* Cuerpo */}
            <div className="px-12 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Columna central */}
                <div className="lg:col-span-7 space-y-10">
                    {/* Info general */}
                    <section className="bg-white p-6 rounded-xl shadow">
                        <h2 className="text-2xl font-bold mb-4">{evento.titulo}</h2>
                        <p className="text-gray-700 mb-6">{evento.descripcion_corta}</p>

                        {evento.url_imagen ? (
                            <img
                                src={evento.url_imagen}
                                alt={evento.titulo}
                                className="h-64 object-cover rounded-xl mb-6 shadow"
                            />
                        ) : (
                            <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 mb-6">
                                Imagen no disponible
                            </div>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                                <span className="font-semibold flex items-center gap-1">
                                    <CalendarDays className="w-4 h-4 text-gray-500" />
                                    Fecha
                                </span>
                                <p>{evento.fecha_evento}</p>
                            </div>
                            <div>
                                <span className="font-semibold flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    Hora
                                </span>
                                <p>{evento.hora}</p>
                            </div>
                            <div>
                                <span className="font-semibold flex items-center gap-1">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    Ubicación
                                </span>
                                <p>{evento.ubicacion}</p>
                            </div>
                            <div>
                                <span className="font-semibold flex items-center gap-1">
                                    <Users2 className="w-4 h-4 text-gray-500" />
                                    Asistentes
                                </span>
                                <p>{evento.asistentes_list?.length || 0} confirmados</p>
                            </div>
                        </div>


                        {rol !== "nada" && (
                            <div className="flex gap-3 mt-6 justify-between">
                                <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                    Evento {evento.tipo_evento === "publico" ? "Público" : "Privado"}
                                </span>

                                <span className={
                                    "text-sm font-medium px-3 py-1 rounded-full capitalize " +
                                    (rol === "organizador"
                                        ? "bg-blue-100 text-blue-600"
                                        : rol === "asistenciapendiente"
                                            ? "bg-yellow-100 text-yellow-600"
                                            : "bg-purple-100 text-purple-600")
                                }>
                                    {rol === "asistenciapendiente" ? "Pendiente" : rol}
                                </span>
                            </div>
                        )}


                    </section>

                    {/* Mapa */}
                    <section className="bg-white p-6 rounded-xl shadow">
                        <h3 className="text-xl font-semibold mb-4">Ubicación del evento</h3>
                        {mapUrl ? (
                            <a href={linkToMaps} target="_blank" rel="noopener noreferrer" className="block relative rounded-lg overflow-hidden w-full h-60">
                                <img
                                    src={mapUrl}
                                    alt="Mapa del evento"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 drop-shadow-md">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="#ef4444"
                                            className="w-3.5 h-3.5"
                                        >
                                            <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                                        </svg>
                                        <span className="truncate max-w-[90%]">{evento.ubicacion}</span>
                                    </div>
                                </div>
                            </a>
                        ) : (
                            <div className="w-full h-60 bg-gray-100 flex items-center justify-center text-sm text-gray-500 rounded-lg">
                                Mapa no disponible
                            </div>
                        )}
                        <p className="text-gray-600 mt-2 text-sm">
                            Ubicación: {evento.ubicacion} <br />
                            Latitud, Longitud: {evento.latitud}, {evento.longitud}
                        </p>
                    </section>


                    {/* Recursos */}
                    {evento.url_recurso && (
                        <section className="bg-white p-6 rounded-xl shadow">
                            <h3 className="text-xl font-semibold mb-4">Recursos</h3>
                            <a
                                href={evento.url_recurso}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-blue-600 hover:underline"
                            >
                                <img src="/file-icon.svg" alt="Archivo" className="w-6 h-6" />
                                Lista de ingredientes (Archivo)
                            </a>
                        </section>
                    )}
                </div>

                {/* Columna derecha */}
                <div className="lg:col-span-5 space-y-10">
                    {rol === "organizador" && (
                        <section className="bg-white p-6 rounded-xl shadow">
                            <h3 className="text-xl font-semibold mb-4">Acciones</h3>

                            <div className="flex gap-4">
                                <button className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all">
                                    Invitar Personas
                                </button>
                                <button onClick={() => router.push(`/editarEvento/${id}`)} className="bg-blue-200 hover:bg-blue-300 cursor-pointer text-blue-600 font-semibold py-2 px-4 rounded-lg shadow-sm transition-all">
                                    Editar Evento
                                </button>
                                <button className="bg-red-600 hover:bg-red-700 cursor-pointer text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all">
                                    Eliminar Evento
                                </button>
                            </div>
                        </section>
                    )}
                    {/* Asistentes */}
                    <section className="bg-white p-6 rounded-xl shadow">
                        <h3 className="text-xl font-semibold mb-4">
                            Asistentes ({evento.asistentes_list?.length || 0})
                        </h3>

                        <div className="max-h-64 overflow-y-auto pr-1">
                            <ul className="space-y-3">
                                {(evento.asistentes_list || []).map((u, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        {u.url_imagen ? (
                                            <img
                                                src={u.url_imagen}
                                                alt={u.nombre}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center font-bold text-white">
                                                {u.nombre?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                        )}
                                        <span className="text-sm text-gray-800 truncate max-w-[200px]">
                                            {u.correo}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Foro */}
                    <section className="bg-white p-6 rounded-xl shadow">
                        <h3 className="text-xl font-semibold mb-4">Foro</h3>
                        <ul className="space-y-4">
                            {(evento.foro || []).map((coment, i) => (
                                <li key={i} className="bg-gray-100 p-3 rounded-lg text-sm">
                                    <strong className="block mb-1">{coment.usuario}</strong>
                                    <p>{coment.texto}</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
            <AdviceSimple
                isOpen={adviceOpen}
                message={adviceMessage}
                onClose={() => {
                    setAdviceOpen(false);
                    window.location.reload();
                }}
            />
            <Advice
                isOpen={cancelAdviceOpen}
                message="¿Seguro que deseas cancelar tu inscripción?"
                onConfirm={handleCancelarAsistencia}
                onClose={() => setCancelAdviceOpen(false)}
            />


        </main >
    );
}
