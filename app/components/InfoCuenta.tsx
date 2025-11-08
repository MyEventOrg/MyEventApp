import React from 'react';
import { ProfileData } from '../(client)/perfil/types';

// Componente para la información de la cuenta
export default function InfoCuenta({ profileData }: { profileData: ProfileData }) {
  return (
    <section className="bg-white rounded-xl shadow p-6 mb-10">
      <h2 className="text-base font-semibold text-gray-800 mb-4">Información de la Cuenta</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-10">
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-600">Fecha de registro:</span>
          <span>{profileData.fecha_registro}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-600">Estado:</span>
          {profileData.estado ? (
            <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 border border-green-200 font-medium">Activa</span>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 font-medium">Inactiva</span>
          )}
        </div>
      </div>
    </section>
  );
}