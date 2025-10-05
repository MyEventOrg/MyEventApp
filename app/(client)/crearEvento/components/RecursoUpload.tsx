import React from "react";

interface Props {
    value: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RecursoUpload: React.FC<Props> = ({ value, onChange }) => {
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        
        if (!file) {
            onChange(e); // Pasar el evento original si no hay archivo
            return;
        }

        // Validaciones estrictas para PDFs
        if (file.type !== 'application/pdf') {
            alert('Solo se permiten archivos PDF');
            e.target.value = ''; // Limpiar el input
            return;
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            alert('El archivo PDF no puede ser mayor a 10MB');
            e.target.value = ''; // Limpiar el input
            return;
        }

        // Validar extensión del archivo
        const fileName = file.name.toLowerCase();
        if (!fileName.endsWith('.pdf')) {
            alert('El archivo debe tener extensión .pdf');
            e.target.value = ''; // Limpiar el input
            return;
        }

        onChange(e); // Pasar el evento original si todo está bien
    };

    return (
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
                            Solo archivos PDF (máximo 10MB)
                        </p>
                    </div>
                </div>
                <input
                    type="file"
                    name="url_recurso"
                    accept=".pdf,application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                />
            </div>
            {value && (
                <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded-md">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Archivo PDF seleccionado: {value.name}</span>
                </div>
            )}
        </div>
    );
};

export default RecursoUpload;
