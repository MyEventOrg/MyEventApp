import base from "./base";

const uploadImagen = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await base.postImg("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return res.data;
    } catch (error) {
        console.error("Error subiendo imagen:", error);
        return { ok: false, message: "No se pudo subir la imagen" };
    }
};

export default { uploadImagen };
