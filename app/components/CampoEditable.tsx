import React from 'react';

// Configuración de validaciones por campo
const fieldConfig = {
  nombreCompleto: { min: 3, max: 40, label: 'Nombre completo' },
  apodo: { min: 3, max: 12, label: 'Apodo' },
  correo: { min: 0, max: 40, label: 'Correo' }
};

// Campo editable reutilizable para inputs de perfil
export default function CampoEditable({ label, name, value, isEditing, onChange }: {
  label: string;
  name: string;
  value: string;
  isEditing: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const config = fieldConfig[name as keyof typeof fieldConfig] || { min: 0, max: 40, label };
  const currentLength = value.length;
  const isValidLength = currentLength >= config.min && currentLength <= config.max;
  const showValidation = isEditing && name !== 'correo';
  return (
    <div>
      <label className="block text-xs text-gray-600 mb-1" htmlFor={name}>{label}</label>
      <div className="relative">
        <input
          id={name}
          type={name === 'correo' ? 'email' : 'text'}
          name={name}
          maxLength={config.max}
          className={`w-full rounded border px-3 py-1.5 text-sm pr-8 transition-colors ${isEditing
              ? showValidation && !isValidLength
                ? 'bg-white border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
              : 'bg-gray-50 border-gray-300'
            }`}
          value={value}
          readOnly={!isEditing}
          onChange={onChange}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
          {isEditing ? (
            <img src="/perfil/assets/lock-blue.svg" alt="Editar" width={18} height={18} />
          ) : (
            <img src="/perfil/assets/lock-gray.svg" alt="Bloqueado" width={18} height={18} />
          )}
        </span>
      </div>

      {/* Contador y validaciones */}
      {showValidation && (
        <div className="mt-1 flex justify-between items-center text-xs">
          <div>
            {currentLength < config.min ? (
              <span className="text-red-500">
                Mínimo {config.min} caracteres (faltan {config.min - currentLength})
              </span>
            ) : currentLength > config.max ? (
              <span className="text-red-500">
                Máximo {config.max} caracteres (sobran {currentLength - config.max})
              </span>
            ) : null}
          </div>
          <div className={`font-mono ${currentLength > config.max ? 'text-red-500' :
              currentLength < config.min ? 'text-orange-500' :
                'text-gray-500'
            }`}>
            {currentLength}/{config.max}
          </div>
        </div>
      )}
    </div>
  );
}