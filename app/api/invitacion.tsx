import base from "./base";

export interface AsistenciaRequest {
    evento_id: number;
    usuario_id: number;
}

export interface AsistenciaResponse {
    success: boolean;
    message: string;
}

const asistirEvento = async (data: AsistenciaRequest): Promise<AsistenciaResponse> => {
    try {
        const response = await base.post("/asistenciaEvento", data);
        return response.data;
    } catch (error: any) {
        console.error("Error en asistirEvento:", error);

        // Si axios trae error del backend
        if (error.response) {
            return error.response.data;
        }

        // Error inesperado
        return {
            success: false,
            message: "Error al procesar la solicitud."
        };
    }
};

// 👉 Anular asistencia
const anularAsistencia = async (data: AsistenciaRequest): Promise<AsistenciaResponse> => {
    try {
        const response = await base.post("/anularAsistencia", data);
        return response.data;
    } catch (error: any) {
        console.error("Error en anularAsistencia:", error);

        if (error.response) return error.response.data;

        return {
            success: false,
            message: "Error al procesar la solicitud."
        };
    }
};

export default { asistirEvento, anularAsistencia };
