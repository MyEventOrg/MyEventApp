import base from "./base";

export type Totals = { creados: number; asistiendo: number; guardados: number };

export type EventoLite = {
    evento_id: number;
    titulo: string;
    descripcion_corta: string;
    fecha_evento: string; // "YYYY-MM-DD"
    hora: string;         // "HH:mm"
    tipo_evento: string;
    ubicacion: string | null;
    ciudad?: string | null;
    distrito?: string | null;
    url_imagen?: string | null;
};

export type MisEventosResponse = {
    success: boolean;
    message?: string;
    data: {
        usuario_id: number;
        totals: Totals;
        data: {
            eventosCreados: EventoLite[];
            eventosAsistiendo: EventoLite[];
            eventosGuardados: EventoLite[];
        };
    };
};

const getResumenMisEventos = async (
    usuarioId: number
): Promise<MisEventosResponse> => {
    const { data } = await base.get<MisEventosResponse>(`/resumen/${usuarioId}`);
    return data;
};


const getResumenTotals = async (usuarioId: number): Promise<Totals> => {
    const resp = await getResumenMisEventos(usuarioId);
    return resp.data.totals;
};

export default { getResumenMisEventos, getResumenTotals };