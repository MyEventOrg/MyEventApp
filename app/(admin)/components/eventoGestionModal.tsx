"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import EventoApi from "../../api/eventoo";

interface Evento {
    evento_id: number;
    titulo: string;
    estado_evento: string;
}

interface EventoGestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    evento: Evento | null;
    onAfterUpdate?: () => void;
}

export default function EventoGestionModal({ isOpen, onClose, evento, onAfterUpdate }: EventoGestionModalProps) {
    const estadosDisponibles = ["pendiente", "activo", "rechazado"];
    const [nuevoEstado, setNuevoEstado] = useState(evento?.estado_evento || "");
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!evento) return;
        setLoading(true);

        const res = await EventoApi.updateEstadoEvento(evento.evento_id, nuevoEstado);

        setLoading(false);

        if (res.success) {
            if (onAfterUpdate) onAfterUpdate();
            onClose();
        } else {
            alert("Error al actualizar el estado");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && evento && (
                <motion.div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-lg shadow-2xl w-[500px] max-w-full p-6 relative"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Botón cerrar */}
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg font-bold"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold text-[#3F78A1] mb-4">
                            Gestionar evento: {evento.titulo}
                        </h2>

                        <p className="mb-2">
                            <span className="font-semibold text-gray-700">Estado actual:</span>{" "}
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
                        </p>

                        <p className="mb-2 text-gray-700">
                            ¿A qué estado deseas cambiar este evento?
                        </p>

                        <select
                            className="border rounded px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-[#3F78A1]"
                            value={nuevoEstado}
                            onChange={(e) => setNuevoEstado(e.target.value)}
                        >
                            {estadosDisponibles.map((estado) => (
                                <option key={estado} value={estado}>
                                    {estado}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className={`px-4 py-2 rounded text-white ${loading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-[#3F78A1] hover:bg-[#356688]"
                                    }`}
                            >
                                {loading ? "Guardando..." : "Confirmar"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
