
// Modal para invitar personas a eventos
// Incluye sugeridos de usuarios previamente invitados

"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { X, Mail, UserPlus, Users } from "lucide-react";
import invitacionApi from "../api/invitacion";
import toast from "react-hot-toast";

interface InvitarPersonasModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventoId: number;
    eventoTitulo: string;
    organizadorId: number;
    onInvitacionEnviada?: () => void;
}

/**
 * Modal para invitar personas a un evento
 * Permite ingresar múltiples correos tipo "chips" (como Google Drive)
 * Muestra sugeridos de usuarios previamente invitados
 */
export default function InvitarPersonasModal({
    isOpen,
    onClose,
    eventoId,
    eventoTitulo,
    organizadorId,
    onInvitacionEnviada
}: InvitarPersonasModalProps) {
    const [correos, setCorreos] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [sugeridos, setSugeridos] = useState<string[]>([]);
    const [mostrarSugeridos, setMostrarSugeridos] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [errorMensaje, setErrorMensaje] = useState<string>(""); // JUAN-MODIFICACION: Mensaje de error visible

    // Cargar sugeridos al abrir
    useEffect(() => {
        if (isOpen && organizadorId) {
            cargarSugeridos();
        }
    }, [isOpen, organizadorId]);

    const cargarSugeridos = async () => {
        const sugeridosData = await invitacionApi.obtenerSugeridos(organizadorId);
        setSugeridos(sugeridosData);
    };

    /**
     * Agrega un correo a la lista
     * Valida formato y evita duplicados
     */
    const agregarCorreo = (correo: string) => {
        const correoTrim = correo.trim().toLowerCase();

        // JUAN-MODIFICACION: Solo mensaje visual, sin toast al agregar
        if (!correoTrim) {
            if (correo.length > 0) {
                const msg = "El correo no puede estar vacío";
                setErrorMensaje(msg);
                setTimeout(() => setErrorMensaje(""), 3000);
            }
            return;
        }

        // Validar formato básico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correoTrim)) {
            const msg = `"${correoTrim}" no es un correo válido`;
            setErrorMensaje(msg);
            setTimeout(() => setErrorMensaje(""), 3000);
            return;
        }

        // Evitar duplicados con mensaje específico
        if (correos.includes(correoTrim)) {
            const msg = `"${correoTrim}" ya está en la lista`;
            setErrorMensaje(msg);
            setTimeout(() => setErrorMensaje(""), 3000);
            return;
        }

        // Agregar exitosamente (sin toast, solo visual)
        setCorreos([...correos, correoTrim]);
        setInputValue("");
        setMostrarSugeridos(false);
        setErrorMensaje(""); // Limpiar error
    };

    /**
     * Maneja teclas especiales en el input
     * Enter o coma → agregar correo
     * Backspace → eliminar último correo si input vacío
     */
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            if (inputValue.trim()) {
                agregarCorreo(inputValue);
            }
        } else if (e.key === "Backspace" && !inputValue && correos.length > 0) {
            // Eliminar último correo
            setCorreos(correos.slice(0, -1));
        }
    };

    /**
     * Elimina un correo de la lista (sin toast)
     */
    const eliminarCorreo = (correo: string) => {
        setCorreos(correos.filter(c => c !== correo));
    };

    /**
     * Agrega correo sugerido
     */
    const agregarSugerido = (correo: string) => {
        agregarCorreo(correo);
    };

    /**
     * Envía invitaciones con rol seleccionado
     */
    const enviarInvitaciones = async (rol: "asistente") => {
        if (correos.length === 0) {
            toast.error("Agrega al menos un correo");
            return;
        }

        setEnviando(true);

        try {
            const resultado = await invitacionApi.enviarInvitaciones({
                evento_id: eventoId,
                organizador_id: organizadorId,
                correos,
                mensaje: undefined // Por ahora sin mensaje personalizado
            });

            // JUAN-MODIFICACION: Mostrar retroalimentación detallada siempre
            // Si todas fallaron, mostrar por qué
            if (resultado.invitaciones_enviadas === 0) {
                const problemas = [];
                
                if (resultado.correos_ya_participan && resultado.correos_ya_participan.length > 0) {
                    const count = resultado.correos_ya_participan.length;
                    if (count === 1) {
                        problemas.push(`${resultado.correos_ya_participan[0]} ya participa en el evento`);
                    } else {
                        problemas.push(`${count} usuarios ya participan`);
                    }
                }
                
                if (resultado.correos_ya_invitados && resultado.correos_ya_invitados.length > 0) {
                    const count = resultado.correos_ya_invitados.length;
                    if (count === 1) {
                        problemas.push(`${resultado.correos_ya_invitados[0]} ya tiene invitación pendiente`);
                    } else {
                        problemas.push(`${count} usuarios ya tienen invitaciones pendientes`);
                    }
                }
                
                if (resultado.correos_rechazaron && resultado.correos_rechazaron.length > 0) {
                    const count = resultado.correos_rechazaron.length;
                    if (count === 1) {
                        problemas.push(`${resultado.correos_rechazaron[0]} rechazó anteriormente`);
                    } else {
                        problemas.push(`${count} usuarios rechazaron anteriormente`);
                    }
                }
                
                if (resultado.correos_no_encontrados && resultado.correos_no_encontrados.length > 0) {
                    const count = resultado.correos_no_encontrados.length;
                    if (count === 1) {
                        problemas.push(`${resultado.correos_no_encontrados[0]} no está registrado`);
                    } else {
                        problemas.push(`${count} correos no registrados`);
                    }
                }
                
                if (resultado.correos_mismo_organizador && resultado.correos_mismo_organizador.length > 0) {
                    problemas.push("No puedes invitarte a ti mismo");
                }
                
                // Mostrar un toast por cada problema para mejor legibilidad
                if (problemas.length > 0) {
                    // Primero mostrar los detalles específicos
                    problemas.forEach((problema, index) => {
                        setTimeout(() => {
                            toast(problema, { 
                                icon: "⚠️",
                                duration: 5000,
                                style: {
                                    maxWidth: '500px',
                                }
                            });
                        }, index * 100); // Pequeño delay para que aparezcan ordenados
                    });
                    // Al final mostrar el mensaje principal
                    setTimeout(() => {
                        toast.error("No se pudo enviar invitaciones", { duration: 5000 });
                    }, problemas.length * 100);
                } else {
                    toast.error("No se pudo enviar ninguna invitación", { duration: 5000 });
                }
            } else {
                // Si hubo éxito, mostrar mensaje de éxito
                const rolTexto = rol === "asistente" ? "asistente(s)" : "co-administrador(es)";
                toast.success(
                    `✅ ${resultado.invitaciones_enviadas} invitación(es) enviada(s) como ${rolTexto}`,
                    { duration: 4000 }
                );
                
                // Mostrar advertencias de los que no se pudieron (si hubo algunos exitosos y otros fallidos)
                if (resultado.correos_ya_participan && resultado.correos_ya_participan.length > 0) {
                    const count = resultado.correos_ya_participan.length;
                    toast(count === 1 
                        ? `⚠️ ${resultado.correos_ya_participan[0]} ya participa` 
                        : `⚠️ ${count} usuarios ya participan`, 
                        { icon: "ℹ️", duration: 4000 }
                    );
                }
                
                if (resultado.correos_no_encontrados && resultado.correos_no_encontrados.length > 0) {
                    const count = resultado.correos_no_encontrados.length;
                    toast(count === 1 
                        ? `⚠️ ${resultado.correos_no_encontrados[0]} no registrado` 
                        : `⚠️ ${count} correos no registrados`, 
                        { icon: "ℹ️", duration: 4000 }
                    );
                }
                
                // Limpiar y cerrar solo si hubo éxito
                setCorreos([]);
                setInputValue("");
                onInvitacionEnviada?.();
                onClose();
            }
        } catch (error) {
            toast.error("Error al enviar invitaciones");
        } finally {
            setEnviando(false);
        }
    };

    if (!isOpen) return null;

    // Filtrar sugeridos que no estén ya agregados
    const sugeridosFiltrados = sugeridos.filter(s => 
        !correos.includes(s) && 
        s.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-40">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Invitar Personas</h2>
                        <p className="text-sm text-gray-600 mt-1">{eventoTitulo}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Input de correos con chips */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 inline mr-1" />
                            Correos electrónicos
                        </label>
                        <div className="border border-gray-300 rounded-lg p-2 min-h-[100px] max-h-[200px] overflow-y-auto focus-within:ring-2 focus-within:ring-blue-500">
                            <div className="flex flex-wrap gap-2">
                                {/* Chips de correos agregados */}
                                {correos.map((correo, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                    >
                                        {correo}
                                        <button
                                            onClick={() => eliminarCorreo(correo)}
                                            className="hover:text-blue-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </span>
                                ))}

                                {/* Input */}
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value);
                                        setMostrarSugeridos(e.target.value.length > 0);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => setMostrarSugeridos(true)}
                                    placeholder={correos.length === 0 ? "Escribe correos y presiona Enter o coma" : ""}
                                    className="flex-1 min-w-[200px] outline-none text-sm"
                                    disabled={enviando}
                                />
                            </div>
                        </div>
                        
                        {/* JUAN-MODIFICACION: Mensaje de error visible */}
                        {errorMensaje ? (
                            <p className="text-xs text-red-600 mt-1 font-medium">
                                ⚠️ {errorMensaje}
                            </p>
                        ) : (
                            <p className="text-xs text-gray-500 mt-1">
                                Presiona Enter o coma (,) para agregar cada correo
                            </p>
                        )}
                    </div>

                    {/* Sugeridos */}
                    {mostrarSugeridos && sugeridosFiltrados.length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-2 max-h-[150px] overflow-y-auto bg-gray-50">
                            <p className="text-xs font-medium text-gray-600 mb-2">
                                <Users className="w-3 h-3 inline mr-1" />
                                Usuarios invitados anteriormente:
                            </p>
                            <div className="space-y-1">
                                {sugeridosFiltrados.map((correo, index) => (
                                    <button
                                        key={index}
                                        onClick={() => agregarSugerido(correo)}
                                        className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg text-sm text-gray-700 transition"
                                    >
                                        {correo}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contador */}
                    {correos.length > 0 && (
                        <div className="text-sm text-gray-600">
                            {correos.length} correo{correos.length !== 1 ? "s" : ""} agregado{correos.length !== 1 ? "s" : ""}
                        </div>
                    )}
                </div>

                {/* Footer - Botones de acción */}
                <div className="p-6 border-t bg-gray-50 space-y-3">
                    <p className="text-sm text-gray-600 mb-3">
                        Invitar como:
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => enviarInvitaciones("asistente")}
                            disabled={enviando || correos.length === 0}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" />
                            Enviar Invitaciones
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={enviando}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium transition disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
