"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Evento {
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
}

interface EventoModalProps {
    isOpen: boolean;
    onClose: () => void;
    evento: Evento | null;
}

export default function EventoModal({ isOpen, onClose, evento }: EventoModalProps) {
    return (
        <AnimatePresence>
            {isOpen && evento && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-xl shadow-2xl max-w-5xl w-full h-[500px] grid grid-cols-2 overflow-hidden relative"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute cursor-pointer top-2 right-2 text-gray-500 hover:text-red-500 text-lg font-bold z-10"
                        >
                            ✕
                        </button>

                        <div className="relative">
                            <img
                                src={`${evento?.url_imagen}?t=${new Date(evento?.fecha_creacion_evento).getTime()}`}
                                alt={evento?.titulo}
                                className="w-full h-full object-cover"
                            />


                            <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-4">
                                <h2 className="text-2xl font-bold">{evento?.titulo}</h2>
                                <p className="text-sm italic">{evento?.descripcion_corta}</p>
                            </div>
                        </div>

                        <div className="p-6 flex flex-col gap-3 overflow-y-auto">
                            <p>
                                <span className="font-semibold text-[#3F78A1]">Descripción:</span>{" "}
                                {evento?.descripcion_larga}
                            </p>
                            <p>
                                <span className="font-semibold text-[#3F78A1]">Fecha de creación:</span>{" "}
                                {new Date(evento?.fecha_creacion_evento || "").toLocaleDateString()}
                            </p>
                            <p>
                                <span className="font-semibold text-[#3F78A1]">Fecha del evento:</span>{" "}
                                {new Date(evento?.fecha_evento || "").toLocaleDateString()} — {evento?.hora}
                            </p>
                            <p>
                                <span className="font-semibold text-[#3F78A1]">Ubicación:</span>{" "}
                                {evento?.ubicacion}, {evento?.ciudad}, {evento?.distrito}
                            </p>
                            <p>
                                <span className="font-semibold text-[#3F78A1]">Estado:</span>{" "}
                                <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${evento?.estado_evento === "pendiente"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : evento?.estado_evento === "activo"
                                            ? "bg-green-100 text-green-700"
                                            : evento?.estado_evento === "rechazado"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    {evento?.estado_evento}
                                </span>
                            </p>
                            <p>
                                <span className="font-semibold text-[#3F78A1]">Categoría:</span>{" "}
                                {evento?.categoria_id}
                            </p>

                            <div className="flex gap-4 mt-2">
                                <a
                                    href={evento?.url_direccion}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    Ver mapa
                                </a>
                                <a
                                    href={evento?.url_recurso}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    Recurso adicional
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
