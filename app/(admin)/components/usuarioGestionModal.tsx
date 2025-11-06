"use client";

import { motion, AnimatePresence } from "framer-motion";
import UsuarioApi from "../../api/usuario";

interface Usuario {
    usuario_id: number;
    nombreCompleto: string;
    correo: string;
    activo: number;
}

interface UsuarioGestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    usuario: Usuario | null;
    onAfterUpdate: () => void;
}

export default function UsuarioGestionModal({
    isOpen,
    onClose,
    usuario,
    onAfterUpdate,
}: UsuarioGestionModalProps) {
    const handleChangeEstado = async () => {
        if (!usuario) return;

        const nuevoEstado = usuario.activo ? 0 : 1;

        const res = await UsuarioApi.updateUsuarioEstado(usuario.usuario_id, nuevoEstado);

        if (res.success !== false) {
            onAfterUpdate();
        } else {
            console.error("Error al cambiar estado:", res.message);
        }

        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && usuario && (
                <motion.div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-lg shadow-2xl w-[400px] p-6 relative"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute cursor-pointer top-2 right-2 text-gray-500 hover:text-red-500 text-lg font-bold"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold text-[#3F78A1] mb-4">
                            Gestionar Usuario
                        </h2>

                        <p className="mb-2 text-gray-700">
                            <span className="font-semibold">Usuario:</span> {usuario.nombreCompleto}
                        </p>
                        <p className="mb-2 text-gray-700">
                            <span className="font-semibold">Correo:</span> {usuario.correo}
                        </p>

                        <p className="mb-2">
                            <span className="font-semibold text-gray-700">Estado actual:</span>{" "}
                            {usuario.activo ? (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                                    Activo
                                </span>
                            ) : (
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                                    Inactivo
                                </span>
                            )}
                        </p>

                        <p className="mb-2 text-gray-700">
                            ¿Quieres cambiar el estado de este usuario?
                        </p>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleChangeEstado}
                                className={`px-4 py-2 rounded text-white ${usuario.activo
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-green-600 hover:bg-green-700"
                                    }`}
                            >
                                {usuario.activo ? "Desactivar" : "Activar"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
