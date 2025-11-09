import base from "./base";

export type EventoGuardado = {
    evento_id: number;
    titulo: string;
    descripcion_corta: string;
    fecha_evento: string; // YYYY-MM-DD
    hora: string; // HH:mm
    tipo_evento: string;
    ubicacion: string | null;
    ciudad?: string | null;
    distrito?: string | null;
    url_imagen?: string | null;
    url_direccion?: string | null;
    estado_evento: string;
    asistentes: number;
    latitud?: string | null;
    longitud?: string | null;
};

export type EventosGuardadosResponse = {
    success: boolean;
    message: string;
    data: {
        usuario_id: number;
        total: number;
        eventos: EventoGuardado[];
    };
};

const getEventosGuardados = async (
    usuarioId: number
): Promise<EventosGuardadosResponse> => {
    const resp = await base.get<EventosGuardadosResponse>(`/guardados/${usuarioId}`);
    return resp.data;
};

const guardarEvento = async (
    usuario_id: number,
    evento_id: number
): Promise<{ success: boolean; message: string }> => {
    const resp = await base.post("/guardarEvento", {
        usuario_id,
        evento_id,
    });
    return resp.data;
};

const eliminarEventoGuardado = async (
    usuario_id: number,
    evento_id: number
): Promise<{ success: boolean; message: string }> => {
    const resp = await base.remove("/eliminarEventoGuardado", {
        data: { usuario_id, evento_id },
    });
    return resp.data;
};

export default { getEventosGuardados, guardarEvento, eliminarEventoGuardado };