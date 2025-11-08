import React, { useRef, useState } from 'react';
import CampoEditable from './CampoEditable';
import { ProfileData } from '../(client)/perfil/types';

// Componente para mostrar y editar los datos de perfil
export default function DatosPerfil({
  profileData,
  isEditing,
  isDirty,
  isValidForm,
  onEditClick,
  onInputChange,
  onSave,
  saving,
  onPictureChange,
  onDeletePhoto,
}: {
  profileData: ProfileData;
  isEditing: boolean;
  isDirty: boolean;
  isValidForm?: boolean;
  onEditClick: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  saving: boolean;
  onPictureChange: (file: File) => void;
  onDeletePhoto: () => void;
}) {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPictureChange(file);
    }
  };


  return (
    <>
      <section className={`rounded-xl shadow p-6 mb-6 relative transition-colors duration-300 ${isEditing ? 'ring-2 ring-[#3b82f6] bg-[#eaf2fe]' : 'bg-white'}`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">Datos de Perfil</h2>
            {isEditing && (
              <span
                className="ml-2 px-2 py-0.5 rounded text-xs font-bold animate-pulse border border-[#3b82f6] bg-[#eaf2fe] text-[#2563eb]"
              >
                Modo edición
              </span>
            )}
          </div>
          <button
            className={`p-1 rounded hover:bg-[#2563eb]/10 ${isDirty ? 'bg-red-100' : isEditing ? 'bg-[#3b82f6]/20' : ''}`}
            title={isDirty ? 'Cancelar edición' : 'Editar perfil'}
            onClick={onEditClick}
            type="button"
          >
            {isDirty ? (
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#dc2626" strokeWidth="1.5" fill="#fff" />
                <path stroke="#dc2626" strokeWidth="2" strokeLinecap="round" d="M9 9l6 6m0-6l-6 6" />
              </svg>
            ) : (
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path stroke={isEditing ? '#3b82f6' : '#444'} strokeWidth="1.5" d="M16.475 5.425a2.121 2.121 0 0 1 3 3l-9.9 9.9a1 1 0 0 1-.464.263l-3.6.9a.5.5 0 0 1-.606-.606l.9-3.6a1 1 0 0 1 .263-.464l9.9-9.9Z" />
                <path stroke={isEditing ? '#3b82f6' : '#444'} strokeWidth="1.5" strokeLinecap="round" d="M15 7 17 9" />
              </svg>
            )}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">

          <div className={`flex flex-col items-center transition-colors duration-300 ${isEditing ? 'bg-[#eaf2fe]' : ''}`}>
            <div className="mb-2 relative w-24 h-24 group">
              <div
                className="w-24 h-24 rounded-full border-4 border-blue-200 bg-white flex items-center justify-center overflow-hidden shadow-lg cursor-pointer"
                title="Foto de perfil"
                onClick={() => setShowModal(true)}
              >
                {profileData.foto_url ? (
                  <img
                    src={profileData.foto_url}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover rounded-full"
                    draggable={false}
                  />
                ) : (
                  <img
                    src="/perfil/assets/usuario_defecto.svg"
                    alt="Usuario por defecto"
                    className="w-full h-full object-cover rounded-full"
                    draggable={false}
                  />
                )}
              </div>
              {/* Botón editar solo visible en hover */}
              <button
                type="button"
                className="absolute bottom-0 right-0 mb-2 mr-2 bg-white border border-gray-300 rounded-full shadow-md p-1.5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:shadow-lg hover:border-blue-400"
                style={{ zIndex: 2 }}
                onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                title="Cambiar foto de perfil"
              >
                <img src="/perfil/assets/edit-photo.svg" alt="Editar foto" width={22} height={22} />
              </button>
              <input
                type="file"
                name="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />
            </div>
            <button
              type="button"
              className="text-xs text-red-500 hover:underline font-medium mb-2 disabled:opacity-50"
              onClick={onDeletePhoto}
              disabled={!profileData.foto_url}
            >
              Eliminar foto
            </button>
          </div>

          <div className="flex-1 grid grid-cols-1 gap-3">
            <CampoEditable
              label="Nombre completo"
              name="nombreCompleto"
              value={profileData.nombreCompleto}
              isEditing={isEditing}
              onChange={onInputChange}
            />
            <CampoEditable
              label="Apodo"
              name="apodo"
              value={profileData.apodo}
              isEditing={isEditing}
              onChange={onInputChange}
            />
            <CampoEditable
              label="Correo electrónico"
              name="correo"
              value={profileData.correo}
              isEditing={false}
            />
            <div className="flex justify-end mt-2">
              {isDirty && isEditing && (
                <button
                  className={`px-5 py-2 rounded font-medium shadow transition text-sm ${isValidForm
                      ? 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  onClick={onSave}
                  disabled={saving || !isValidForm}
                  type="button"
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              )}
            </div>
          </div>

        </div>
      </section>
      {/* Modal para mostrar la imagen en grande */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <img
            src={profileData.foto_url || "/perfil/assets/usuario_defecto.svg"}
            alt="Foto de perfil grande"
            className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg border-4 border-white"
            draggable={false}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}