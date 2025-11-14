"use client";

import { useState, useEffect } from "react";
import { Heart, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import comentarioApi from "../api/comentarioEvento";
import { useUser } from "../context/userContext";

interface ComentarioData {
    comentarioevento_id: number;
    mensaje: string;
    likes: number;
    dislikes: number;
    usuario_id: number;
    Usuario: {
        nombreCompleto: string;
        apodo: string | null;
        url_imagen: string | null;
    };
}

interface ForoEventoProps {
    evento_id: number;
    estado_evento: string;
}

export default function ForoEvento({ evento_id, estado_evento }: ForoEventoProps) {
    const { user, isAuthenticated } = useUser();
    const [comentarios, setComentarios] = useState<ComentarioData[]>([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [userVotes, setUserVotes] = useState<Record<number, 'like' | 'dislike' | null>>({});

    // Cargar votos del localStorage al montar
    useEffect(() => {
        if (user) {
            const votosGuardados = localStorage.getItem(`votos_${user.usuario_id}`);
            if (votosGuardados) {
                setUserVotes(JSON.parse(votosGuardados));
            }
        }
    }, [user]);

    // Guardar votos en localStorage cuando cambien
    const guardarVotosEnStorage = (nuevosVotos: Record<number, 'like' | 'dislike' | null>) => {
        if (user) {
            localStorage.setItem(`votos_${user.usuario_id}`, JSON.stringify(nuevosVotos));
        }
    };

    const puedeEscribir = estado_evento === 'activo' && isAuthenticated;

    // Cargar comentarios al montar el componente
    useEffect(() => {
        cargarComentarios();
    }, [evento_id]);

    const cargarComentarios = async () => {
        setLoading(true);
        const response = await comentarioApi.getComentariosByEvento(evento_id);
        if (response.success) {
            setComentarios(response.data || []);
        }
        setLoading(false);
    };

    const enviarComentario = async () => {
        if (!user || !nuevoComentario.trim() || enviando) return;

        setEnviando(true);
        const response = await comentarioApi.createComentario({
            evento_id,
            usuario_id: user.usuario_id,
            mensaje: nuevoComentario.trim()
        });

        if (response.success) {
            setNuevoComentario("");
            await cargarComentarios();
        }
        setEnviando(false);
    };

    const toggleLike = async (comentario_id: number) => {
        if (!user) return;
        
        const votoActual = userVotes[comentario_id];
        
        if (votoActual === 'like') {
            // Ya tiene like, quitarlo
            const response = await comentarioApi.updateLikes(comentario_id, 'unlike');
            if (response.success) {
                const nuevosVotos = { ...userVotes, [comentario_id]: null };
                setUserVotes(nuevosVotos);
                guardarVotosEnStorage(nuevosVotos);
                await cargarComentarios();
            }
        } else {
            // No tiene like o tiene dislike, dar like
            const response = await comentarioApi.updateLikes(comentario_id, 'like');
            if (response.success) {
                // Si tenía dislike, también quitarlo
                if (votoActual === 'dislike') {
                    await comentarioApi.updateDislikes(comentario_id, 'undislike');
                }
                const nuevosVotos = { ...userVotes, [comentario_id]: 'like' as const };
                setUserVotes(nuevosVotos);
                guardarVotosEnStorage(nuevosVotos);
                await cargarComentarios();
            }
        }
    };

    const toggleDislike = async (comentario_id: number) => {
        if (!user) return;
        
        const votoActual = userVotes[comentario_id];
        
        if (votoActual === 'dislike') {
            // Ya tiene dislike, quitarlo
            const response = await comentarioApi.updateDislikes(comentario_id, 'undislike');
            if (response.success) {
                const nuevosVotos = { ...userVotes, [comentario_id]: null as null };
                setUserVotes(nuevosVotos);
                guardarVotosEnStorage(nuevosVotos);
                await cargarComentarios();
            }
        } else {
            // No tiene dislike o tiene like, dar dislike
            const response = await comentarioApi.updateDislikes(comentario_id, 'dislike');
            if (response.success) {
                // Si tenía like, también quitarlo
                if (votoActual === 'like') {
                    await comentarioApi.updateLikes(comentario_id, 'unlike');
                }
                const nuevosVotos = { ...userVotes, [comentario_id]: 'dislike' as const };
                setUserVotes(nuevosVotos);
                guardarVotosEnStorage(nuevosVotos);
                await cargarComentarios();
            }
        }
    };

    const eliminarComentario = async (comentario_id: number) => {
        if (!user) return;
        
        const response = await comentarioApi.deleteComentario(comentario_id, user.usuario_id);
        if (response.success) {
            await cargarComentarios();
        }
    };

    const obtenerNombreUsuario = (comentario: ComentarioData) => {
        return comentario.Usuario.apodo || comentario.Usuario.nombreCompleto;
    };

    if (loading) {
        return (
            <section className="bg-white p-6 rounded-xl shadow">
                <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-5 h-5" />
                    <h3 className="text-xl font-semibold">Foro del Evento</h3>
                </div>
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5" />
                <h3 className="text-xl font-semibold">Foro del Evento</h3>
                <span className="text-sm text-gray-500">({comentarios.length})</span>
            </div>

            {/* Formulario para nuevo comentario */}
            {puedeEscribir && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <textarea
                        value={nuevoComentario}
                        onChange={(e) => setNuevoComentario(e.target.value)}
                        placeholder="Escribe tu comentario..."
                        maxLength={200}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                            {nuevoComentario.length}/200 caracteres
                        </span>
                        <button
                            onClick={enviarComentario}
                            disabled={!nuevoComentario.trim() || enviando}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {enviando ? "Enviando..." : "Comentar"}
                        </button>
                    </div>
                </div>
            )}

            {/* Mensaje si no puede comentar */}
            {!puedeEscribir && isAuthenticated && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">
                        Los comentarios están deshabilitados para eventos inactivos.
                    </p>
                </div>
            )}

            {/* Lista de comentarios */}
            <div className="space-y-4">
                {comentarios.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
                    </div>
                ) : (
                    comentarios.map((comentario) => (
                        <div key={comentario.comentarioevento_id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                        {obtenerNombreUsuario(comentario)[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">
                                            {obtenerNombreUsuario(comentario)}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Botón eliminar para el que comentó */}
                                {user && user.usuario_id === comentario.usuario_id && (
                                    <button
                                        onClick={() => eliminarComentario(comentario.comentarioevento_id)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Eliminar comentario"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            
                            <p className="text-gray-700 mb-3">{comentario.mensaje}</p>
                            
                            {/* Botones de like */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => toggleLike(comentario.comentarioevento_id)}
                                    disabled={!isAuthenticated}
                                    className={`flex items-center gap-1 text-sm transition-colors ${
                                        userVotes[comentario.comentarioevento_id] === 'like'
                                            ? 'text-blue-600 font-semibold'
                                            : 'text-gray-500 hover:text-blue-600 disabled:hover:text-gray-500'
                                    }`}
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    {comentario.likes}
                                </button>
                                
                                <button
                                    onClick={() => toggleDislike(comentario.comentarioevento_id)}
                                    disabled={!isAuthenticated}
                                    className={`flex items-center gap-1 text-sm transition-colors ${
                                        userVotes[comentario.comentarioevento_id] === 'dislike'
                                            ? 'text-red-600 font-semibold'
                                            : 'text-gray-500 hover:text-red-600 disabled:hover:text-gray-500'
                                    }`}
                                >
                                    <ThumbsDown className="w-4 h-4" />
                                    {comentario.dislikes}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}