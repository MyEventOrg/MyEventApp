"use client";

import { useState } from "react";
import Link from "next/link";
import CodigoVerificacion from "./components/codigoverificacion";
import Formulario from "./components/formulario";

export default function Register() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

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
      setStep(2); // pasa a verificación
    }, 2000);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-[#2c4a68]">
        {step === 1 && "Valida tu correo"}
        {step === 2 && "Código de verificación"}
        {step === 3 && "Crear cuenta"}
      </h1>
      <p className="text-gray-700 mb-6">
        {step === 1 && "Ingresa tu correo para continuar"}
        {step === 2 && "Te enviamos un código a tu correo"}
        {step === 3 && "Únete a MyEvent"}
      </p>

      {/* Contenedor con slide horizontal */}
      <div className="relative w-full h-[300px]">
        {/* Paso 1: email */}
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
            className="w-full px-4 py-3 mb-4 rounded-[20px] bg-white shadow-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
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

        {/* Paso 2: código verificación */}
        <div
          className={`absolute w-full transition-all duration-700 ${step === 2
            ? "translate-x-0 opacity-100"
            : step < 2
              ? "translate-x-full opacity-0"
              : "-translate-x-full opacity-0"
            }`}
        >
          <CodigoVerificacion
            email={email}
            onVerified={() => setStep(3)}
          />
        </div>

        {/* Paso 3: formulario */}
        <div
          className={`absolute w-full transition-all duration-700 ${step === 3
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
            }`}
        >
          <Formulario email={email} />
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-700 text-center">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="text-[#4a90e2] hover:underline">
          Inicia sesión aquí
        </Link>
      </p>
    </>
  );
}
