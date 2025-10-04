"use client";

import { motion, AnimatePresence } from "framer-motion";

interface AdviceProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
}

export default function Advice({ isOpen, message, onConfirm, onClose }: AdviceProps) {
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
                            <button
                                onClick={onClose}
                                className="px-5 py-2 cursor-pointer rounded-md bg-gray-300 text-gray-800 font-medium hover:bg-gray-400 transition"
                            >
                                No
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className="px-5 py-2 rounded-md cursor-pointer bg-[#3F78A1] text-white font-medium hover:bg-[#356688] transition"
                            >
                                Sí
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
