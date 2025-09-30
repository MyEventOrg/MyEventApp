import React from "react";

interface Props {
    value: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    preview: string | null;
}

const ImagenUpload: React.FC<Props> = ({ value, onChange, preview }) => (
    <div>
        <label className="font-semibold">Imagen del evento*</label>
        <div
            className="border-dashed border-2 rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 bg-white hover:border-blue-400 hover:bg-blue-50"
        >
            {preview ? (
                <img src={preview} alt="Preview" className="w-40 h-40 object-cover mb-4 rounded shadow" />
            ) : (
                <span className="text-blue-400 mb-4 flex flex-col items-center">
                    <svg width="56" height="56" fill="none" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 16.5l-4-4 1.41-1.41L12 13.67l2.59-2.58L16 12.5l-4 4z"/>
                    </svg>
                    <span className="text-lg font-semibold mt-2">Arrastra o selecciona una imagen</span>
                </span>
            )}
            <div className="w-full flex flex-col items-center mt-2">
                <label htmlFor="imagen-upload" className="mb-2 text-base font-medium text-gray-700 cursor-pointer hover:text-blue-600">
                    <span className="block">Seleccionar archivo</span>
                    <span className="block text-sm text-gray-500 font-normal mt-1">
                        {value ? (
                            <span className="font-semibold text-gray-700">{value.name}</span>
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
                    className="w-full"
                    onChange={onChange}
                    required
                    style={{ display: "none" }}
                />
            </div>
            <span className="text-xs text-gray-500 mt-3">Subir imagen o arrastrar y soltar <span className="font-semibold text-blue-600">PNG, JPG, GIF</span></span>
        </div>
    </div>
);

export default ImagenUpload;
