import base from "./base";

export type EventoCreado = {
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
};

export type MisEventosResponse = {
    success: boolean;
    message: string;
    data: {
        usuario_id: number;
        total: number;
        eventosCreados: EventoCreado[];
    };
};

const getEventosCreados = async (
    usuarioId: number
): Promise<MisEventosResponse> => {
    const resp = await base.get<MisEventosResponse>(`/mis-eventos-creados/${usuarioId}`);
    return resp.data;
};

export default { getEventosCreados };