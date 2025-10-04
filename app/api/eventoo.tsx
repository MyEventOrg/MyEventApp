import base from "./base";
import axios from "axios";

// Crear instancia específica para archivos
const fileApi = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true,
    validateStatus: () => true,
});

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
        // Si hay un archivo PDF, usar FormData
        if (eventoData.url_recurso && eventoData.url_recurso instanceof File) {
            const formData = new FormData();
            
            // Agregar todos los campos del evento
            Object.keys(eventoData).forEach(key => {
                if (key === 'url_recurso' && eventoData[key] instanceof File) {
                    formData.append('pdf', eventoData[key]); // Nombre correcto para el backend
                } else if (eventoData[key] !== null && eventoData[key] !== undefined) {
                    formData.append(key, eventoData[key].toString());
                }
            });

            console.log("🚀 Enviando evento con PDF adjunto");
            
            const res = await fileApi.post(`/eventos`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return res.data;
        } else {
            // Si no hay archivo, enviar como JSON normal
            const res = await base.post(`/eventos`, eventoData);
            return res.data;
        }
    } catch (error) {
        console.error("❌ Error al crear evento:", error);
        return { success: false, message: "No se pudo crear el evento" };
    }
};

export default { getEventosPublicos, getEventosPrivados, updateEstadoEvento, createEvento };
