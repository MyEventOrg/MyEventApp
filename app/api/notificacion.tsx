import base from "./base";

type EnviarPayload = { email: string };

const enviarCodigo = async (data: EnviarPayload) => {
    try {
        const res = await base.post("/enviar-codigo", data);
        return res.data;
    } catch {
        return { success: false, message: "No se pudo enviar el código" };
    }
};

type VerificarPayload = { email: string, code: string };

const verificarCodigo = async (data: VerificarPayload) => {
    try {
        const res = await base.post("/verificar-codigo", data);
        return res.data;
    } catch {
        return { success: false, message: "No se pudo verificar el código" };
    }
};

export default { enviarCodigo, verificarCodigo };
