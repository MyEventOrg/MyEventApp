"use client";

import { useState } from "react";
import UsuarioApi from "../../../api/usuario";
import { useRouter } from "next/navigation";

interface Props {
  email: string;
  showAviso: (texto: string, tipo: string) => void;
}

export default function Formulario({ email, showAviso }: Props) {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [apodo, setApodo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showAviso("Las contraseñas no coinciden", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await UsuarioApi.crearUsuario({
        nombres,
        apellidos,
        apodo,
        email,
        password,
      });

      if (res.success) {
        localStorage.setItem("toastMessage", "Cuenta creada con éxito");
        router.push("/login");
      }
      else {
        showAviso(res.message || "No se pudo crear la cuenta", "error");
      }

    } catch (error) {
      showAviso("Error de conexión con el servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <input
        type="text"
        placeholder="Nombres"
        value={nombres}
        onChange={(e) => setNombres(e.target.value)}
        autoComplete="off"
        className="w-full px-4 py-3 rounded-[20px] bg-white shadow-md 
                   text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
        required
      />

      <input
        type="text"
        placeholder="Apellidos"
        value={apellidos}
        onChange={(e) => setApellidos(e.target.value)}
        autoComplete="off"
        className="w-full px-4 py-3 rounded-[20px] bg-white shadow-md 
                   text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
        required
      />

      <input
        type="text"
        placeholder="Apodo"
        value={apodo}
        onChange={(e) => setApodo(e.target.value)}
        autoComplete="off"
        className="w-full px-4 py-3 rounded-[20px] bg-white shadow-md 
                   text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
        required
      />

      <input
        type="password"
        placeholder="Mínimo 6 caracteres"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        className="w-full px-4 py-3 rounded-[20px] bg-white shadow-md 
                   text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
        required
      />

      <input
        type="password"
        placeholder="Repite tu contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        className="w-full px-4 py-3 rounded-[20px] bg-white shadow-md 
                   text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#4a90e2] text-white py-2 rounded-md shadow 
                   hover:bg-[#3a78b8] transition disabled:opacity-50"
      >
        {loading ? "Creando..." : "Crear cuenta"}
      </button>
    </form>
  );
}
