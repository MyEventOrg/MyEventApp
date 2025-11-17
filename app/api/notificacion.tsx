import base from "./base";

type EnviarPayload = { email: string };

export interface Notificacion {
    notificacion_id: number;
    fecha_creacion: string;
    mensaje: string;
    visto: boolean;
    usuario_id: number;
    evento_id: number;
}
export interface NotificacionResponse {
    ok: boolean;
    notificaciones: Notificacion[];
}

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

const getNotificaciones = async (usuario_id: number): Promise<NotificacionResponse> => {
    try {
        const res = await base.get<NotificacionResponse>(`/notificaciones/${usuario_id}`);
        return res.data;
    } catch {
        return { ok: false, notificaciones: [] };
    }
};


const notificacionVista = async (
    notificacion_id: number
): Promise<{ ok: boolean; message: string }> => {
    try {
        const res = await base.put("/notificacionvista", { notificacion_id });
        return res.data;
    } catch {
        return { ok: false, message: "No se pudo marcar como vista" };
    }
};

export default { enviarCodigo, verificarCodigo, getNotificaciones, notificacionVista };
