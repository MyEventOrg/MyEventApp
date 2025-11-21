"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import eventoApi from "../../../api/evento";
import { CalendarDays, Clock, MapPin, Users2 } from "lucide-react";
import { useUser } from "../../../context/userContext";
import asistenciaApi from "../../../api/invitacion";
import AdviceSimple from "../../../components/AdviceSimple";
import Advice from "../../../components/Advice";
import ForoEvento from "../../../components/ForoEvento";
import invitacionApi from "../../../api/invitacion";

// JUAN-MODIFICACION: Import del modal de invitaciones (HU40)
import InvitarPersonasModal from "../../../components/InvitarPersonasModal";

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
        usuario_id: number;
        nombre: string;
        apodo: string | null;
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
    const [deleteAdviceOpen, setDeleteAdviceOpen] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    // JUAN-MODIFICACION: Estado para controlar el modal de invitaciones (HU40)
    const [modalInvitarOpen, setModalInvitarOpen] = useState(false);
    // Estados para búsqueda y menú de asistentes
    const [buscarAsistente, setBuscarAsistente] = useState("");
    const [menuAsistenteAbierto, setMenuAsistenteAbierto] = useState<number | null>(null);

    const handleCancelarAsistencia = async (): Promise<void> => {
        if (!user?.usuario_id) return;

        const res = await asistenciaApi.anularAsistencia({
            evento_id: Number(id),
            usuario_id: user.usuario_id,
        });

        setAdviceMessage(res.message);

        if (res.success) {
            router.push("/");
        } else {
            setAdviceOpen(true);
        }
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

    // Cerrar menú de asistente al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuAsistenteAbierto !== null) {
                setMenuAsistenteAbierto(null);
            }
        };

        if (menuAsistenteAbierto !== null) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [menuAsistenteAbierto]);

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

    const handleDeleteEvento = async () => {
        if (!user?.usuario_id) return;

        const res = await eventoApi.deleteEvento(Number(id), user.usuario_id);

        setDeleteMessage(res.message);

        if (res.success) {
            // Mostrar aviso rápido
            localStorage.setItem("eventoBorrado", "El evento ha sido eliminado correctamente");
            router.push("/");
        } else {
            setAdviceOpen(true);
        }
    };
    const confirmDeleteEvento = () => {
        setDeleteAdviceOpen(true);
    };
    const mapUrl = buildStaticMapUrl(evento.latitud, evento.longitud);
    const linkToMaps = evento.url_direccion || (evento.latitud && evento.longitud ? `https://www.google.com/maps?q=${evento.latitud},${evento.longitud}` : undefined);
    const handleEliminarAsistente = async (usuario_id: number, nombre: string) => {
        if (!user?.usuario_id) return;

        const res = await invitacionApi.eliminarAsistente(Number(id), usuario_id, user.usuario_id);

        if (res.success) {
            // Actualizar lista de asistentes
            const nuevaLista = evento.asistentes_list?.filter(u => u.usuario_id !== usuario_id);
            setEvento({
                ...evento,
                asistentes_list: nuevaLista,
                asistentes: evento.asistentes - 1
            });
            setMenuAsistenteAbierto(null);
            setAdviceMessage(`${nombre} ha sido eliminado del evento`);
            setAdviceOpen(true);
        } else {
            setAdviceMessage(res.message || "Error al eliminar asistente");
            setAdviceOpen(true);
        }
    };
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
                                <button
                                    onClick={() => setModalInvitarOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all"
                                >
                                    Invitar Personas
                                </button>
                                <button onClick={() => router.push(`/editarEvento/${id}`)} className="bg-blue-200 hover:bg-blue-300 cursor-pointer text-blue-600 font-semibold py-2 px-4 rounded-lg shadow-sm transition-all">
                                    Editar Evento
                                </button>
                                <button
                                    onClick={confirmDeleteEvento}
                                    className="bg-red-600 hover:bg-red-700 cursor-pointer text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all"
                                >
                                    Eliminar Evento
                                </button>

                            </div>
                        </section>
                    )}
                    {/* Asistentes */}
                    <section className="bg-white p-6 rounded-xl shadow">
                        <h3 className="text-xl font-semibold mb-4">
                            Asistentes ({(evento.asistentes_list || []).filter(u => {
                                if (!buscarAsistente || buscarAsistente.length < 2) return true;
                                const search = buscarAsistente.toLowerCase();
                                return (
                                    (u.apodo && u.apodo.toLowerCase().includes(search)) ||
                                    u.correo.toLowerCase().includes(search) ||
                                    u.nombre.toLowerCase().includes(search)
                                );
                            }).length})
                        </h3>

                        {/* Buscador */}
                        {(evento.asistentes_list || []).length > 5 && (
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Buscar asistente..."
                                    value={buscarAsistente}
                                    onChange={(e) => setBuscarAsistente(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        <div className={`pr-1 ${(evento.asistentes_list || []).length > 4 ? 'max-h-[340px] overflow-y-auto overflow-x-visible' : ''}`}>
                            <ul className="space-y-3 pb-16">
                                {(evento.asistentes_list || [])
                                    .filter(u => {
                                        if (!buscarAsistente || buscarAsistente.length < 2) return true;
                                        const search = buscarAsistente.toLowerCase();
                                        return (
                                            (u.apodo && u.apodo.toLowerCase().includes(search)) ||
                                            u.correo.toLowerCase().includes(search) ||
                                            u.nombre.toLowerCase().includes(search)
                                        );
                                    })
                                    .map((u, i) => (
                                        <li key={i} className="flex items-center justify-between gap-3 py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                {u.url_imagen ? (
                                                    <img
                                                        src={u.url_imagen}
                                                        alt={u.nombre}
                                                        className="w-10 h-10 rounded-full object-cover shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white shrink-0">
                                                        {(u.apodo || u.nombre)?.charAt(0).toUpperCase() || "U"}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-800 truncate">
                                                        <span className="font-bold">{u.apodo || u.nombre}</span>
                                                        <span className="text-gray-500"> / {u.correo}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Menú de opciones (solo para organizador) */}
                                            {rol === "organizador" && (
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMenuAsistenteAbierto(menuAsistenteAbierto === u.usuario_id ? null : u.usuario_id);
                                                        }}
                                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                                    >
                                                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                        </svg>
                                                    </button>

                                                    {/* Dropdown */}
                                                    {menuAsistenteAbierto === u.usuario_id && (
                                                        <div className="absolute right-0 top-full w-48 bg-white rounded-lg shadow-2xl border border-gray-200 z-[9999]">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEliminarAsistente(u.usuario_id, u.apodo || u.nombre);
                                                                }}
                                                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                Eliminar asistente
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                            </ul>
                            {(evento.asistentes_list || []).filter(u => {
                                if (!buscarAsistente || buscarAsistente.length < 2) return true;
                                const search = buscarAsistente.toLowerCase();
                                return (
                                    (u.apodo && u.apodo.toLowerCase().includes(search)) ||
                                    u.correo.toLowerCase().includes(search) ||
                                    u.nombre.toLowerCase().includes(search)
                                );
                            }).length === 0 && buscarAsistente.length >= 2 && (
                                    <p className="text-center text-gray-500 py-4">No se encontraron asistentes</p>
                                )}
                        </div>
                    </section>


                    {/* Foro */}
                    <ForoEvento
                        evento_id={evento.evento_id}
                        estado_evento={evento.estado_evento}
                    />
                </div>
            </div>
            <AdviceSimple
                isOpen={adviceOpen}
                message={adviceMessage}
                onClose={async () => {
                    setAdviceOpen(false);
                    // Recargar datos del evento sin refrescar la página
                    if (user?.usuario_id) {
                        const res = await eventoApi.getEventoById(Number(id), user.usuario_id);
                        if (res.success) {
                            setEvento(res.data);
                            setRol(res.data.rol);
                        }
                    }
                }}
            />
            <Advice
                isOpen={cancelAdviceOpen}
                message="¿Seguro que deseas cancelar tu inscripción?"
                onConfirm={handleCancelarAsistencia}
                onClose={() => setCancelAdviceOpen(false)}
            />

            <Advice
                isOpen={deleteAdviceOpen}
                message="¿Estás seguro que quieres eliminar el evento?"
                onConfirm={handleDeleteEvento}
                onClose={() => setDeleteAdviceOpen(false)}
            />
            {/* JUAN-MODIFICACION: Modal de Invitar Personas (HU40) */}
            {user && evento && (
                <InvitarPersonasModal
                    isOpen={modalInvitarOpen}
                    onClose={() => setModalInvitarOpen(false)}
                    eventoId={evento.evento_id}
                    eventoTitulo={evento.titulo}
                    organizadorId={user.usuario_id}
                    onInvitacionEnviada={async () => {
                        // Recargar evento para actualizar lista de asistentes sin refrescar la página
                        const res = await eventoApi.getEventoById(Number(id), user.usuario_id);
                        if (res.success) {
                            setEvento(res.data);
                        }
                    }}
                />
            )}
        </main >
    );
}
