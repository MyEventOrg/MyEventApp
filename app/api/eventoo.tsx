import base from "./base";

// Obtener eventos públicos con paginación
const getEventosPublicos = async (page: number = 1) => {
    try {
        const res = await base.get(`/eventos/publicos?page=${page}`);
        return res.data;
    } catch {
        return { success: false, message: "No se pudieron obtener los eventos públicos" };
    }
};

// Obtener eventos privados con paginación
const getEventosPrivados = async (page: number = 1) => {
    try {
        const res = await base.get(`/eventos/privados?page=${page}`);
        return res.data;
    } catch {
        return { success: false, message: "No se pudieron obtener los eventos privados" };
    }
};

const updateEstadoEvento = async (id: number, estado: string) => {
    try {
        const res = await base.put(`/eventos/${id}/estado`, { estado });
        return res.data;
    } catch {
        return { success: false, message: "No se pudo actualizar el estado del evento" };
    }
};

// Crear nuevo evento
const createEvento = async (eventoData: any) => {
    try {
        const res = await base.post(`/eventos`, eventoData);
        return res.data;
    } catch {
        return { success: false, message: "No se pudo crear el evento" };
    }
};

export default { getEventosPublicos, getEventosPrivados, updateEstadoEvento, createEvento };
