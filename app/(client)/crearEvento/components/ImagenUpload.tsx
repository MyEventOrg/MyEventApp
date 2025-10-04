"use client";
import React, { useState } from "react";
import uploadApi from "../../../api/uploadImg";

interface Props {
    value: string | null;
    onUrlChange: (url: string) => void;
}

const ImagenUpload: React.FC<Props> = ({ value, onUrlChange }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [subiendo, setSubiendo] = useState(false);

    const handleSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        if (!selected) return;

        setFile(selected);
        setMensaje(null);

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(selected);

        try {
            setSubiendo(true);
            const res = await uploadApi.uploadImagen(selected);

            if (res.ok) {
                setMensaje("Imagen subida correctamente");
                console.log("URL Cloudinary:", res.url);

                onUrlChange(res.url);
            } else {
                setMensaje("Error al subir la imagen");
            }
        } catch (err) {
            console.error(err);
            setMensaje("No se pudo conectar al servidor");
        } finally {
            setSubiendo(false);
        }
    };

    return (
        <div>
            <label className="font-semibold">Imagen del evento*</label>
            <div
                className={`border-dashed border-2 rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 ${subiendo ? "bg-gray-50" : "bg-white hover:border-blue-400 hover:bg-blue-50"
                    }`}
            >
                {preview || value ? (
                    <img
                        src={preview || value!}
                        alt="Preview"
                        className="w-40 h-40 object-cover mb-4 rounded shadow"
                    />
                ) : (
                    <span className="text-blue-400 mb-4 flex flex-col items-center">
                        <svg width="56" height="56" fill="none" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M12 16.5l-4-4 1.41-1.41L12 13.67l2.59-2.58L16 12.5l-4 4z"
                            />
                        </svg>
                        <span className="text-lg font-semibold mt-2">
                            Arrastra o selecciona una imagen
                        </span>
                    </span>
                )}

                <div className="w-full flex flex-col items-center mt-2">
                    <label
                        htmlFor="imagen-upload"
                        className="mb-2 text-base font-medium text-gray-700 cursor-pointer hover:text-blue-600"
                    >
                        <span className="block">Seleccionar archivo</span>
                        <span className="block text-sm text-gray-500 font-normal mt-1">
                            {file ? (
                                <span className="font-semibold text-gray-700">{file.name}</span>
                            ) : (
                                <span className="italic text-gray-400">Sin archivos seleccionados</span>
                            )}
                        </span>
                    </label>
                    <input
                        id="imagen-upload"
                        type="file"
                        name="url_imagen"
                        accept="image/png, image/jpeg, image/jpg, image/gif"
                        onChange={handleSelectFile}
                        required
                        style={{ display: "none" }}
                    />
                </div>

                {subiendo && (
                    <p className="mt-3 text-sm text-blue-600 animate-pulse">
                        Subiendo imagen...
                    </p>
                )}
                {mensaje && (
                    <p
                        className={`mt-3 text-sm font-semibold ${mensaje.includes("✅")
                            ? "text-green-600"
                            : mensaje.includes("ERROR")
                                ? "text-red-500"
                                : "text-yellow-600"
                            }`}
                    >
                        {mensaje}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ImagenUpload;
