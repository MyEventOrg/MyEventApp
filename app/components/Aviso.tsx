"use client";

import { motion, AnimatePresence } from "framer-motion";

interface AvisoProps {
    mensaje: string;
    visible: boolean;
    tipo: string;
}

export default function Aviso({ mensaje, visible, tipo }: AvisoProps) {
    const bgColor =
        tipo === "error"
            ? "bg-red-500"
            : "bg-indigo-500";

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key={mensaje}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className={`${bgColor} fixed bottom-6 right-6 text-white px-4 py-2 rounded shadow-lg z-[999999] pointer-events-none font-medium`}
                >
                    {mensaje}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
