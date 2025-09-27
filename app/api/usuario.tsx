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


export default { iniciarSesion , cerrarSesion};
