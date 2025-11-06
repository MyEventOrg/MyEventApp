import base from "./base";

const uploadImagen = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await base.postImg("/upload/image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return res.data;
    } catch (error: any) {
        console.error("Error subiendo imagen:", error);
        return { ok: false, message: error.response?.data?.error || "No se pudo subir la imagen" };
    }
};

const uploadPdf = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await base.postImg("/upload/pdf", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return res.data;
    } catch (error: any) {
        console.error("Error subiendo PDF:", error);
        return { ok: false, message: error.response?.data?.error || "No se pudo subir el PDF" };
    }
};

export default { uploadImagen, uploadPdf };
