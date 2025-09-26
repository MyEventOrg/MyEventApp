"use client"
import Link from "next/link";
import { useState, } from "react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        //logica api
        router.push("/")
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#cfe4f9]">
            <div className="bg-[#cfe4f9] p-8 rounded-lg w-full max-w-md text-center shadow-sm">

                <div className="flex flex-col items-center mb-6">

                    <img
                        src="/logo.png"
                        alt="Logo MyEvent"
                        className="w-40 h-40 rounded-lg p-2"
                    />

                    <h1 className="text-2xl font-bold text-[#2c4a68] mt-4">MyEvent</h1>
                    <p className="text-gray-700">Inicia sesión en tu cuenta</p>
                </div>


                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                            required
                        />
                        <span
                            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            👁
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#4a90e2] text-white py-2 rounded-md shadow hover:bg-[#3a78b8] transition"
                    >
                        Iniciar sesión
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-700">
                    ¿No tienes una cuenta?{" "}
                    <Link href="/register" className="text-[#4a90e2] hover:underline">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}
