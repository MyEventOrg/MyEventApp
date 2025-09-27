"use client";

import { useState } from "react";

interface Props {
  email: string;
}

export default function Formulario({ email }: Props) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    console.log("Registrado:", { name, email, password });
    alert("Cuenta creada con éxito");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <input
        type="text"
        placeholder="Tu nombre completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="off"
        className="w-full px-4 py-3 rounded-[20px] bg-white shadow-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
        required
      />

      <input
        type="password"
        placeholder="Mínimo 6 caracteres"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        className="w-full px-4 py-3 rounded-[20px] bg-white shadow-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
        required
      />

      <input
        type="password"
        placeholder="Repite tu contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        className="w-full px-4 py-3 rounded-[20px] bg-white shadow-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
        required
      />

      <button
        type="submit"
        className="w-full bg-[#4a90e2] text-white py-2 rounded-md shadow hover:bg-[#3a78b8] transition"
      >
        Crear cuenta
      </button>
    </form>
  );
}
