import base from "./base";

// Obtener todas las categorías
const getCategorias = async () => {
    try {
        const res = await base.get(`/categorias`);
        return res.data;
    } catch {
        return { success: false, message: "No se pudieron obtener las categorías" };
    }
};

export default { getCategorias };