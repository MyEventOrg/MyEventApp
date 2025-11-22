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
// ===== JUAN-MODIFICACION: NUEVAS FUNCIONES DE INVITACIONES (HU40 y HU41) =====

export interface InvitacionCreate {
    evento_id: number;
    organizador_id: number;
    correos: string[];
    mensaje?: string;
}

export interface EnviarInvitacionesResponse {
    success: boolean;
    message: string;
    invitaciones_enviadas: number;
    correos_no_encontrados: string[];
    correos_ya_participan: string[];
    correos_ya_invitados: string[];
    correos_rechazaron: string[]; // JUAN-MODIFICACION: Usuarios que rechazaron
    correos_mismo_organizador: string[]; // JUAN-MODIFICACION
}

export interface ResponderInvitacionRequest {
    usuarioQueResponde_id: number,
    invitado_id: number;
    accion: "aceptar" | "rechazar";
}

export interface ResponderInvitacionResponse {
    success: boolean;
    message: string;
    participacion_creada?: boolean;
}

/**
 * Enviar invitaciones a múltiples correos
 */
const enviarInvitaciones = async (data: InvitacionCreate): Promise<EnviarInvitacionesResponse> => {
    try {
        const response = await base.post("/invitaciones/enviar", data);
        return response.data;
    } catch (error: any) {
        console.error("Error en enviarInvitaciones:", error);
        if (error.response) return error.response.data;
        return {
            success: false,
            message: "Error al enviar invitaciones",
            invitaciones_enviadas: 0,
            correos_no_encontrados: [],
            correos_ya_participan: [],
            correos_ya_invitados: [],
            correos_rechazaron: [],
            correos_mismo_organizador: []
        };
    }
};

/**
 * Responder a una invitación (aceptar o rechazar)
 */
const responderInvitacion = async (
    invitacion_id: number,
    data: ResponderInvitacionRequest
): Promise<ResponderInvitacionResponse> => {
    try {
        const response = await base.put(`/invitaciones/${invitacion_id}/responder`, data);
        return response.data;
    } catch (error: any) {
        console.error("Error en responderInvitacion:", error);
        if (error.response) return error.response.data;
        return {
            success: false,
            message: "Error al responder invitación"
        };
    }
};


/**
 * Obtener invitaciones pendientes de un usuario
 */
const obtenerInvitacionesPendientes = async (usuario_id: number) => {
    try {
        const response = await base.get(`/invitaciones/pendientes/${usuario_id}`);
        return response.data;
    } catch (error: any) {
        console.error("Error en obtenerInvitacionesPendientes:", error);
        return { success: false, data: [] };
    }
};

/**
 * Obtener correos sugeridos (usuarios previamente invitados)
 */
const obtenerSugeridos = async (organizador_id: number): Promise<string[]> => {
    try {
        const response = await base.get(`/invitaciones/sugeridos/${organizador_id}`);
        return response.data.data || [];
    } catch (error: any) {
        console.error("Error en obtenerSugeridos:", error);
        return [];
    }
};

/**
 * Obtener asistentes de un evento
 */
const obtenerAsistentesEvento = async (evento_id: number) => {
    try {
        const response = await base.get(`/evento/${evento_id}/asistentes`);
        return response.data;
    } catch (error: any) {
        console.error("Error en obtenerAsistentesEvento:", error);
        return { success: false, data: [] };
    }
};

/**
 * Eliminar asistente de un evento (solo organizador)
 */
const eliminarAsistente = async (evento_id: number, usuario_id: number, organizador_id: number) => {
    try {
        const response = await base.remove(`/evento/${evento_id}/asistente/${usuario_id}?organizador_id=${organizador_id}`);
        return response.data;
    } catch (error: any) {
        console.error("Error en eliminarAsistente:", error);
        if (error.response) return error.response.data;
        return { success: false, message: "Error al eliminar asistente" };
    }
};

/**
 * JUAN-MODIFICACION: Obtener invitación pendiente para usuario y evento específicos
 */
const obtenerInvitacionPendiente = async (evento_id: number, usuario_id: number) => {
    try {
        const response = await base.get(`/invitaciones/${evento_id}/${usuario_id}`);
        return response.data;
    } catch (error: any) {
        console.error("Error en obtenerInvitacionPendiente:", error);
        return { success: false, data: null };
    }
};

export default {
    asistirEvento,
    anularAsistencia,
    enviarInvitaciones,
    responderInvitacion,
    obtenerInvitacionesPendientes,
    obtenerSugeridos,
    obtenerAsistentesEvento,
    obtenerInvitacionPendiente,
    eliminarAsistente
};
