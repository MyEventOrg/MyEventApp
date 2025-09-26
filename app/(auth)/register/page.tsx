"use client"
import { useState } from "react";
import Link from "next/link";

export default function Register() {
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validateEmail = (e: React.FormEvent) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert("Por favor ingresa un correo válido");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 3000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        console.log("Nombre:", name);
        console.log("Email:", email);
        console.log("Password:", password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#cfe4f9]">
            <div className="bg-[#cfe4f9] p-8 rounded-lg w-full max-w-md text-center shadow-sm overflow-hidden relative">
                <h1 className="text-2xl font-bold text-[#2c4a68]">
                    {step === 1 ? "Valida tu correo" : "Crear cuenta"}
                </h1>
                <p className="text-gray-700 mb-6">
                    {step === 1
                        ? "Ingresa tu correo para continuar"
                        : "Únete a MyEvent"}
                </p>

                <div className="relative w-full h-[260px] overflow-hidden">

                    <form
                        onSubmit={validateEmail}
                        className={`absolute w-full transition-all duration-700 ${step === 1
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-full opacity-0"
                            }`}
                    >
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-[#4a90e2] text-white py-2 rounded-md shadow hover:bg-[#3a78b8] transition"
                            disabled={loading}
                        >
                            {loading ? "Validando..." : "Validar correo"}
                        </button>


                        {loading && (
                            <div className="flex justify-center mt-4">
                                <div className="w-8 h-8 border-4 border-[#4a90e2] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </form>

                    <form
                        onSubmit={handleSubmit}
                        className={`absolute w-full transition-all duration-700 ${step === 2
                                ? "translate-x-0 opacity-100"
                                : "translate-x-full opacity-0"
                            }`}
                    >
                        <p className="mb-4 text-green-600 font-semibold">
                            El correo {email} ha sido validado
                        </p>

                        <input
                            type="text"
                            placeholder="Tu nombre completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Repite tu contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                            required
                        />

                        <button
                            type="submit"
                            className="w-full bg-[#4a90e2] text-white py-2 rounded-md shadow hover:bg-[#3a78b8] transition"
                        >
                            Crear cuenta
                        </button>
                    </form>
                </div>


                <p className="mt-6 text-sm text-gray-700 text-center">
                    ¿Ya tienes una cuenta?{" "}
                    <Link href="/login" className="text-[#4a90e2] hover:underline">
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}
