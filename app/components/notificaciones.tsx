"use client";

import { useState } from "react";
import InvitacionApi from "../api/invitacion";
import UsuarioApi from "../api/usuario";
import toast from "react-hot-toast";

type Props = {
    open: boolean;
    notificaciones: any[];
    onClickNotificacion: (id: number) => void;
    usuario_id: number; // JUAN-MODIFICACION: Necesario para responder invitaciones
    onRefresh: () => void; // JUAN-MODIFICACION: Callback para recargar notificaciones
};
const extraerCorreoDeMensaje = (mensaje: string): string | null => {
    const regex = /correo:\s*"([^"]+)"/i;
    const match = mensaje.match(regex);
    return match ? match[1] : null;
};

export default function Notificaciones({ open, notificaciones, onClickNotificacion, usuario_id, onRefresh }: Props) {
    const [procesando, setProcesando] = useState<number | null>(null);

    const formatFecha = (fechaStr: string) => {
        if (!fechaStr) return "Sin fecha";
        const fecha = new Date(fechaStr);
        if (isNaN(fecha.getTime())) return "Fecha inválida";

        return fecha.toLocaleString("es-PE", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // JUAN-MODIFICACION: Manejar respuesta a invitación (aceptar/rechazar)
    const handleResponderInvitacion = async (
        notificacion: any,
        accion: "aceptar" | "rechazar",
        e: React.MouseEvent
    ) => {
        e.stopPropagation();
        setProcesando(notificacion.notificacion_id);

        try {
            // 1. EXTRAER CORREO DEL MENSAJE (si aplica)
            const correo = extraerCorreoDeMensaje(notificacion.mensaje);

            let invitado_id = usuario_id; // Por defecto: invitación normal

            if (correo) {
                // 2. BUSCAR EL USUARIO POR EL CORREO EN EL BACKEND
                const usuarioRes = await UsuarioApi.buscarUsuarioXCorreo(correo);

                if (!usuarioRes.success || !usuarioRes.data) {
                    toast.error("No se encontró el usuario del correo");
                    setProcesando(null);
                    return;
                }

                // este es el solicitante real que será agregado
                invitado_id = usuarioRes.data.usuario_id;
            }

            // 3. OBTENER INVITACIÓN PENDIENTE
            const invRes = await InvitacionApi.obtenerInvitacionPendiente(
                notificacion.evento_id,
                invitado_id
            );

            if (!invRes.success || !invRes.data) {
                toast.error("No se encontró la invitación pendiente");
                setProcesando(null);
                return;
            }

            // 4. RESPONDER INVITACIÓN
            const respuesta = await InvitacionApi.responderInvitacion(
                invRes.data.invitacion_id,
                {
                    usuarioQueResponde_id: usuario_id, // <- quien responde (organizador o invitado)
                    invitado_id,                       // <- quien será agregado al evento
                    accion
                }
            );

            if (respuesta.success) {
                toast.success(respuesta.message);
                onRefresh();
            } else {
                toast.error(respuesta.message);
            }

        } catch (error) {
            console.error("Error al responder invitación:", error);
            toast.error("Error al procesar la respuesta");
        } finally {
            setProcesando(null);
        }
    };


    return (
        <div
            className={`
        absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 transition-all duration-300 ease-out
        ${open
                    ? "max-h-[70vh] opacity-100 pointer-events-auto visible"
                    : "max-h-0 opacity-0 pointer-events-none invisible"
                }
    `}
        >

            <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                    Notificaciones
                </h3>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-4 py-3 space-y-3">

                {notificaciones.map((n) => (
                    <div
                        key={n.notificacion_id}
                        onClick={() => n.tipo !== "invitacion" && onClickNotificacion(n.notificacion_id)}
                        className={`
                            rounded-md p-4 border transition
                            ${n.tipo !== "invitacion" ? "cursor-pointer" : ""}
                            ${!n.visto
                                ? "bg-blue-100 border-blue-500 shadow-md"
                                : "bg-gray-50 border-gray-200"
                            }
                        `}
                    >
                        <p className="text-sm text-gray-800">{n.mensaje}</p>

                        <p className="text-xs text-gray-500 mt-1">
                            {formatFecha(n.fecha_creacion)}
                        </p>

                        {/* JUAN-MODIFICACION: Botones para invitaciones */}
                        {n.tipo === "invitacion" && (
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={(e) => handleResponderInvitacion(n, "aceptar", e)}
                                    disabled={procesando === n.notificacion_id}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {procesando === n.notificacion_id ? "..." : "Aceptar"}
                                </button>
                                <button
                                    onClick={(e) => handleResponderInvitacion(n, "rechazar", e)}
                                    disabled={procesando === n.notificacion_id}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {procesando === n.notificacion_id ? "..." : "Rechazar"}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
