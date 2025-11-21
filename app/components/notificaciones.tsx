"use client";

import { useState } from "react";
import InvitacionApi from "../api/invitacion";
import toast from "react-hot-toast";

type Props = {
    open: boolean;
    notificaciones: any[];
    onClickNotificacion: (id: number) => void;
    usuario_id: number; // JUAN-MODIFICACION: Necesario para responder invitaciones
    onRefresh: () => void; // JUAN-MODIFICACION: Callback para recargar notificaciones
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
        e.stopPropagation(); // Evitar que se marque como vista

        setProcesando(notificacion.notificacion_id);

        try {
            // 1. Buscar la invitación pendiente
            const invRes = await InvitacionApi.obtenerInvitacionPendiente(
                notificacion.evento_id,
                usuario_id
            );

            if (!invRes.success || !invRes.data) {
                toast.error("No se encontró la invitación");
                setProcesando(null);
                return;
            }

            // 2. Responder la invitación
            const respuesta = await InvitacionApi.responderInvitacion(
                invRes.data.invitacion_id,
                { invitado_id: usuario_id, accion }
            );

            if (respuesta.success) {
                toast.success(respuesta.message); // Usar mensaje del backend
                onRefresh(); // Recargar notificaciones
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
