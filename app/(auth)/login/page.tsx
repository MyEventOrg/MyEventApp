"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UsuarioApi from "../../api/usuario";
import Aviso from "../../components/Aviso";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [mensajeAviso, setMensajeAviso] = useState("");
    const [visible, setVisible] = useState(false);
    const [tipo, setTipo] = useState<"error" | "exito">("exito");

    const router = useRouter();

    const showAviso = (texto: string, tipo: "error" | "exito" = "exito") => {
        setMensajeAviso(texto);
        setTipo(tipo);
        setVisible(true);
        setTimeout(() => setVisible(false), 3000);
    };

    useEffect(() => {
        const msg = localStorage.getItem("toastMessage");
        if (msg) {
            showAviso(msg, "exito");
            localStorage.removeItem("toastMessage");
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const resp = await UsuarioApi.iniciarSesion({ email, password });

            if (resp?.success) {
                //middleware hace la logica...
                window.location.reload();
                return;
            }

            showAviso(resp?.message || "Credenciales inválidas", "error");
        } catch {
            showAviso("Error de conexión con el servidor", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col items-center mb-6">
                <img src="/logo.png" alt="Logo MyEvent" className="w-40 h-40 rounded-lg p-2" />
                <h1 className="text-2xl font-bold text-[#2c4a68] mt-4">MyEvent</h1>
                <p className="text-gray-700">Inicia sesión en tu cuenta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-[20px] bg-white shadow-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                    autoComplete="username"
                    required
                />

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-[20px] bg-white shadow-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                        autoComplete="current-password"
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-2.5 cursor-pointer text-gray-500 select-none"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {showPassword ? "Ocultar" : "Ver"}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#4a90e2] text-white py-2 rounded-md shadow hover:bg-[#3a78b8] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? "Ingresando..." : "Iniciar sesión"}
                </button>
            </form>

            <p className="mt-4 text-sm text-gray-700">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="text-[#4a90e2] hover:underline">
                    Regístrate aquí
                </Link>
            </p>

            {/* ✅ Aviso global */}
            <Aviso mensaje={mensajeAviso} visible={visible} tipo={tipo} />
        </>
    );
}
