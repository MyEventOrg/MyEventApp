"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface AdviceProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void | Promise<void>;
    onClose: () => void;
}

export default function Advice({ isOpen, message, onConfirm, onClose }: AdviceProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = async () => {
        if (isProcessing) return; // evitar doble click

        setIsProcessing(true);

        try {
            await onConfirm(); // ejecuta la acción real
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative flex flex-col gap-6"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className="text-center text-gray-800 text-lg font-medium">{message}</p>

                        <div className="flex justify-center gap-4">
                            {/* Botón NO */}
                            <button
                                onClick={onClose}
                                disabled={isProcessing}
                                className={`px-5 py-2 cursor-pointer rounded-md font-medium transition
                                    ${isProcessing ? "bg-gray-200 text-gray-400 cursor-not-allowed" :
                                        "bg-gray-300 text-gray-800 hover:bg-gray-400"}`}
                            >
                                No
                            </button>

                            {/* Botón SÍ */}
                            <button
                                onClick={handleConfirm}
                                disabled={isProcessing}
                                className={`px-5 py-2 rounded-md cursor-pointer font-medium transition flex items-center justify-center gap-2
                                    ${isProcessing
                                        ? "bg-[#3F78A1]/70 text-white cursor-not-allowed"
                                        : "bg-[#3F78A1] text-white hover:bg-[#356688]"
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="white"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="white"
                                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8h4z"
                                            ></path>
                                        </svg>
                                        Procesando...
                                    </>
                                ) : (
                                    "Sí"
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
