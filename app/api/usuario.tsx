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

export default { iniciarSesion, cerrarSesion, crearUsuario };
