"use client";

import { useEffect, useState } from "react";
import UsuarioApi from "../../api/usuario";
import UsuarioGestionModal from "../components/usuarioGestionModal";

interface Usuario {
    usuario_id: number;
    nombreCompleto: string;
    correo: string;
    contrasena?: string;
    fecha_registro: string;
    activo: number;
    rol: string;
    apodo: string;
}

export default function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [isGestionModalOpen, setIsGestionModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
    const fetchUsuarios = async (p: number, s: string = "") => {
        setLoading(true);
        const res = await UsuarioApi.getUsuariosAdmin(p, s);
        if (res && res.data) {
            setUsuarios(res.data.data);
            setPage(res.data.page);
            setTotalPages(res.data.totalPages);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsuarios(1, search);
    }, [search]);

    return (
        <>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-4">
                        <h1 className="text-2xl font-bold text-[#3F78A1]">Gestión de Usuarios</h1>
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#3F78A1]"
                        />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <button
                            disabled={page <= 1}
                            onClick={() => fetchUsuarios(page - 1)}
                            className={`px-4 py-2 rounded-md text-white ${page <= 1
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-[#3F78A1] hover:bg-[#356688]"
                                }`}
                        >
                            Anterior
                        </button>

                        <span className="text-gray-700 font-medium">
                            Página {page} de {totalPages}
                        </span>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => fetchUsuarios(page + 1)}
                            className={`px-4 py-2 rounded-md text-white ${page >= totalPages
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-[#3F78A1] hover:bg-[#356688]"
                                }`}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>

                <div className="rounded-lg shadow-md border border-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-auto">
                    <table className="w-full table-fixed bg-white text-sm [&_th]:align-middle [&_td]:align-middle">
                        <thead className="bg-[#3F78A1] text-white sticky top-0 z-10">
                            <tr>
                                <th className="px-2 py-2 w-[50px]">#</th>
                                <th className="px-2 py-2 w-[120px]">Acciones</th>
                                <th className="px-2 py-2 w-[250px]">Nombre Completo</th>
                                <th className="px-2 py-2 w-[250px]">Correo</th>
                                <th className="px-2 py-2 w-[150px]">Fecha Registro</th>
                                <th className="px-2 py-2 w-[100px]">Activo</th>
                                <th className="px-2 py-2 w-[120px]">Rol</th>
                                <th className="px-2 py-2 w-[150px]">Apodo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-4 text-gray-500">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : usuarios.length > 0 ? (
                                usuarios.map((usuario, index) => (
                                    <tr
                                        key={usuario.usuario_id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="px-2 py-2">{(page - 1) * 10 + index + 1}</td>
                                        <td className="px-2 py-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedUsuario(usuario);
                                                    setIsGestionModalOpen(true);
                                                }}
                                                className="px-3 py-1 text-xs bg-[#3F78A1] text-white rounded hover:bg-[#356688] transition"
                                            >
                                                Gestionar
                                            </button>
                                        </td>
                                        <td className="px-2 py-2 font-medium break-words">
                                            {usuario.nombreCompleto}
                                        </td>
                                        <td className="px-2 py-2 break-words">{usuario.correo}</td>
                                        <td className="px-2 py-2">
                                            {new Date(usuario.fecha_registro).toLocaleDateString()}
                                        </td>
                                        <td className="px-2 py-2">
                                            {usuario.activo ? (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                                                    Activo
                                                </span>
                                            ) : (
                                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                                                    Inactivo
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-2 py-2">{usuario.rol}</td>
                                        <td className="px-2 py-2">{usuario.apodo}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-4 text-gray-500">
                                        No hay usuarios
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UsuarioGestionModal
                isOpen={isGestionModalOpen}
                onClose={() => setIsGestionModalOpen(false)}
                usuario={selectedUsuario}
                onAfterUpdate={() => fetchUsuarios(page, search)}
            />
        </>

    );
}
