import base from "./base";

export type Totals = { creados: number; asistiendo: number; guardados: number };

export type MisEventosResponse = {
    ok: boolean;
    usuario_id: number;
    totals: Totals;
    // data?: { eventosCreados: any[]; eventosAsistiendo: any[]; eventosGuardados: any[] }
};

const getResumenMisEventos = async (usuarioId: number): Promise<MisEventosResponse> => {
    const { data } = await base.get<MisEventosResponse>(`/resumen/${usuarioId}`);
    return data;
};

const getResumenTotals = async (usuarioId: number): Promise<Totals> => {
    const { totals } = await getResumenMisEventos(usuarioId);
    return totals;
};

export default { getResumenMisEventos, getResumenTotals };
