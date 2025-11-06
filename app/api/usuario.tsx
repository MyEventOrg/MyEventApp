import base from "./base";

type LoginPayload = { email: string; password: string };

const iniciarSesion = async (data: LoginPayload) => {
    const res = await base.post("/login", data);
    return res.data;
};
const cerrarSesion = async () => {
    try {
        const res = await base.post("/logout");
        return res.data;
    } catch {
        return { success: false, message: "No se pudo cerrar sesión" };
    }
};

export type CrearUsuarioPayload = {
    nombres: string;
    apellidos: string;
    apodo: string;
    email: string;
    password: string;
};
const crearUsuario = async (data: CrearUsuarioPayload) => {
    try {
        const res = await base.post("/crear-usuario", data);
        return res.data;
    } catch {
        return { success: false, message: "No se pudo crear el usuario" };
    }
};


const getUsuariosAdmin = async (page: number = 1, search: string = "") => {
    try {
        const res = await base.get(`/usuarios?page=${page}&search=${search}`);
        return res.data;
    } catch {
        return { success: false, message: "No se pudieron obtener los usuarios" };
    }
};

const updateUsuarioEstado = async (id: number, activo: number) => {
    try {
        const res = await base.put(`/usuarios/${id}/estado`, { activo });
        console.log(res);
        return res.data;
    } catch {
        return { success: false, message: "No se pudo actualizar el estado del usuario" };
    }
};

// Perfil
export type PerfilData = {
    usuario_id: number;
    nombreCompleto: string;
    correo: string;
    activo: boolean;
    rol: string;
    apodo?: string | null;
    url_imagen?: string | null;
};

const getPerfil = async () => {
    try {
        const res = await base.get<{ success: boolean; data: PerfilData }>(`/perfil`);
        return res.data;
    } catch {
        return { success: false, message: "No se pudo obtener el perfil" } as any;
    }
};

const updatePerfil = async (payload: { nombreCompleto?: string; apodo?: string }) => {
    try {
        const res = await base.put(`/perfil`, payload);
        return res.data;
    } catch {
        return { success: false, message: "No se pudo actualizar el perfil" };
    }
};

const updateFotoPerfil = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await base.postImg("/perfil/foto", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (e: any) {
        return { success: false, message: e?.response?.data?.message || "No se pudo actualizar la foto" };
    }
};

const eliminarFotoPerfil = async () => {
    try {
        const res = await base.remove(`/perfil/foto`);
        return res.data;
    } catch {
        return { success: false, message: "No se pudo eliminar la foto" };
    }
};

const eliminarCuenta = async () => {
    try {
        const res = await base.remove(`/eliminar-cuenta`);
        return res.data;
    } catch {
        return { success: false, message: "No se pudo eliminar la cuenta" };
    }
};

// Export único con todas las funciones
export default { 
    iniciarSesion, 
    cerrarSesion, 
    crearUsuario, 
    getUsuariosAdmin, 
    updateUsuarioEstado,
    getPerfil,
    updatePerfil,
    updateFotoPerfil,
    eliminarFotoPerfil,
    eliminarCuenta
};
