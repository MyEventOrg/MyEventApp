"use client";
import React, { useState } from "react";

interface Props {
    value: string | null;
    onFileSelect: (file: File | null, preview: string | null) => void;
    required?: boolean;
}

const ImagenUpload: React.FC<Props> = ({ value, onFileSelect, required }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");

    const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (!file) {
            setPreview(null);
            setFileName("");
            onFileSelect(null, null);
            return;
        }

        // Validaciones estrictas para imágenes
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)');
            e.target.value = ''; // Limpiar el input
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('La imagen no puede ser mayor a 5MB');
            e.target.value = ''; // Limpiar el input
            return;
        }

        // Validar extensión del archivo
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const fileName = file.name.toLowerCase();
        const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
        
        if (!hasValidExtension) {
            alert('El archivo debe tener una extensión de imagen válida (.jpg, .jpeg, .png, .gif, .webp)');
            e.target.value = ''; // Limpiar el input
            return;
        }

        setFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            setPreview(dataUrl);
            onFileSelect(file, dataUrl);
        };
        reader.readAsDataURL(file);
    };

    const imgSrc = preview || value || null;

    return (
        <div>
            <label className="font-semibold">Imagen del evento*</label>
            <div className="border-dashed border-2 rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 bg-white hover:border-blue-400 hover:bg-blue-50">
                {imgSrc ? (
                    <img src={imgSrc} alt="Preview" className="w-40 h-40 object-cover mb-4 rounded shadow" />
                ) : (
                    <span className="text-blue-400 mb-4 flex flex-col items-center">
                        <svg width="56" height="56" fill="none" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 16.5l-4-4 1.41-1.41L12 13.67l2.59-2.58L16 12.5l-4 4z" />
                        </svg>
                        <span className="text-lg font-semibold mt-2">Arrastra o selecciona una imagen</span>
                    </span>
                )}

                <div className="w-full flex flex-col items-center mt-2">
                    <label
                        htmlFor="imagen-upload"
                        className="mb-2 text-base font-medium text-gray-700 cursor-pointer hover:text-blue-600"
                    >
                        <span className="block">Seleccionar archivo</span>
                        <span className="block text-sm text-gray-500 font-normal mt-1">
                            {fileName ? (
                                <span className="font-semibold text-gray-700">{fileName}</span>
                            ) : (
                                <span className="italic text-gray-400">Sin archivos seleccionados</span>
                            )}
                        </span>
                    </label>

                    <input
                        id="imagen-upload"
                        type="file"
                        name="url_imagen"
                        accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleSelectFile}
                        required={required}
                        style={{ display: "none" }}
                    />
                </div>

                <p className="mt-3 text-xs text-gray-500">La imagen se subirá al guardar el evento.</p>
            </div>
        </div>
    );
};

export default ImagenUpload;
