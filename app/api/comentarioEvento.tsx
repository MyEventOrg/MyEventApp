import base from "./base";

// Obtener comentarios de un evento
const getComentariosByEvento = async (evento_id: number) => {
    try {
        const res = await base.get(`/comentarios/evento/${evento_id}`);
        return res.data;
    } catch {
        return { success: false, message: "No se pudieron obtener los comentarios" };
    }
};

// Crear nuevo comentario
const createComentario = async (data: { evento_id: number; usuario_id: number; mensaje: string }) => {
    try {
        const res = await base.post("/comentarios", data);
        return res.data;
    } catch {
        return { success: false, message: "No se pudo crear el comentario" };
    }
};

// Actualizar likes de un comentario
const updateLikes = async (comentario_id: number, action: 'like' | 'unlike') => {
    try {
        const res = await base.put(`/comentarios/${comentario_id}/likes`, { action });
        return res.data;
    } catch {
        return { success: false, message: "No se pudieron actualizar los likes" };
    }
};

// Actualizar dislikes de un comentario
const updateDislikes = async (comentario_id: number, action: 'dislike' | 'undislike') => {
    try {
        const res = await base.put(`/comentarios/${comentario_id}/dislikes`, { action });
        return res.data;
    } catch {
        return { success: false, message: "No se pudieron actualizar los dislikes" };
    }
};

// Eliminar comentario
const deleteComentario = async (comentario_id: number, usuario_id: number) => {
    try {
        const res = await base.remove(`/comentarios/${comentario_id}`, { 
            data: { usuario_id } 
        });
        return res.data;
    } catch {
        return { success: false, message: "No se pudo eliminar el comentario" };
    }
};

const comentarioApi = {
    getComentariosByEvento,
    createComentario,
    updateLikes,
    updateDislikes,
    deleteComentario
};

export default comentarioApi;