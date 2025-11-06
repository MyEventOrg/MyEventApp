"use client";

import { useState } from "react";
import NotificacionApi from "../../../api/notificacion";

interface Props {
    email: string;
    onVerified: () => void;
    showAviso: (texto: string, tipo: string) => void;
}

export default function CodigoVerificacion({ email, onVerified, showAviso }: Props) {
    const [code, setCode] = useState(Array(6).fill(""));
    const [loading, setLoading] = useState(false);

    const handleChange = (value: string, index: number) => {
        if (/^\d?$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);
            if (value !== "" && index < code.length - 1) {
                const nextInput = document.getElementById(`code-${index + 1}`);
                if (nextInput) (nextInput as HTMLInputElement).focus();
            }
        }
    };

    const verifyCode = async (e: React.FormEvent) => {
        e.preventDefault();

        if (code.join("").length !== 6) {
            showAviso("Completa los 6 dígitos", "error");
            return;
        }

        setLoading(true);
        try {
            const res = await NotificacionApi.verificarCodigo({
                email,
                code: code.join(""),
            });

            if (res.success) {
                showAviso("Código verificado correctamente", "exito");
                onVerified();
            } else {
                showAviso(res.message || "Código incorrecto", "error");
            }
        } catch {
            showAviso("Error de conexión con el servidor", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={verifyCode} className="flex flex-col items-center gap-6">
            <p className="text-sm text-gray-700">
                Ingresar el código enviado a <b>{email}</b>
            </p>

            <div className="flex gap-2">
                {code.map((digit, i) => (
                    <input
                        key={i}
                        id={`code-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, i)}
                        onInput={(e) =>
                            handleChange((e.target as HTMLInputElement).value, i)
                        }
                        onFocus={(e) => e.target.select()}
                        className="w-10 h-10 text-center text-lg rounded-[10px] bg-white shadow-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                    />
                ))}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4a90e2] text-white py-2 rounded-md shadow hover:bg-[#3a78b8] transition"
            >
                {loading ? "Verificando..." : "Verificar código"}
            </button>
        </form>
    );
}
