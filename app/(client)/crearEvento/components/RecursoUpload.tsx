import React from "react";

interface Props {
    value: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RecursoUpload: React.FC<Props> = ({ value, onChange }) => (
    <div>
        <label className="font-semibold">Recurso PDF (opcional)</label>
        <input
            type="file"
            name="url_recurso"
            accept="application/pdf"
            className="w-full"
            onChange={onChange}
        />
        <span className="text-xs text-gray-500">Sube un PDF con información adicional del evento</span>
    </div>
);

export default RecursoUpload;
