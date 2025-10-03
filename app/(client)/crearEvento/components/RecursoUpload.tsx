import React from "react";

interface Props {
    value: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RecursoUpload: React.FC<Props> = ({ value, onChange }) => (
    <div className="space-y-2">
        <label className="font-semibold text-gray-700">Recurso PDF (opcional)</label>
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
            <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">
                        {value ? value.name : "Seleccionar archivo PDF"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Sube un PDF con información adicional del evento
                    </p>
                </div>
            </div>
            <input
                type="file"
                name="url_recurso"
                accept="application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={onChange}
            />
        </div>
        {value && (
            <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Archivo seleccionado: {value.name}</span>
            </div>
        )}
    </div>
);

export default RecursoUpload;
