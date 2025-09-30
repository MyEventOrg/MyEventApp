import React from "react";

interface Props {
    value: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    preview: string | null;
}

const ImagenUpload: React.FC<Props> = ({ value, onChange, preview }) => (
    <div>
        <label className="font-semibold">Imagen del evento*</label>
        <div className="border-dashed border-2 border-gray-300 rounded p-4 flex flex-col items-center justify-center">
            {preview ? (
                <img src={preview} alt="Preview" className="w-32 h-32 object-cover mb-2 rounded" />
            ) : (
                <span className="text-gray-400 mb-2">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 16.5l-4-4 1.41-1.41L12 13.67l2.59-2.58L16 12.5l-4 4z"/></svg>
                </span>
            )}
            <input
                type="file"
                name="url_imagen"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                className="w-full"
                onChange={onChange}
                required
            />
            <span className="text-xs text-gray-500">Subir imagen o arrastrar y soltar PNG, JPG, GIF</span>
        </div>
    </div>
);

export default ImagenUpload;
