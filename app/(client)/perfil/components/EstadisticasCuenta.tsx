import React from 'react';
import { useEstadisticasUsuario } from '../hooks/useEstadisticasUsuario';

// Componente para las estadísticas de la cuenta
export default function EstadisticasCuenta() {
  const { estadisticas, loading, error } = useEstadisticasUsuario();

  if (loading) return <div className="text-gray-500">Cargando estadísticas...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!estadisticas) return <div className="text-gray-500">No hay estadísticas disponibles.</div>;

  return (
    <section className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-base font-semibold text-gray-800 mb-4">Estadísticas de la Cuenta:</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-gray-50 rounded p-2 text-center">
          <div className="text-xs text-gray-500">Eventos creados:</div>
          <div className="font-bold text-lg">{estadisticas.eventos_creados}</div>
        </div>
        <div className="bg-gray-50 rounded p-2 text-center">
          <div className="text-xs text-gray-500">Eventos guardados:</div>
          <div className="font-bold text-lg">{estadisticas.eventos_guardados}</div>
        </div>
        <div className="bg-gray-50 rounded p-2 text-center">
          <div className="text-xs text-gray-500">Eventos a los que asiste:</div>
          <div className="font-bold text-lg">{estadisticas.eventos_asistidos}</div>
        </div>
        <div className="bg-gray-50 rounded p-2 text-center">
          <div className="text-xs text-gray-500">Notificaciones:</div>
          <div className="font-bold text-lg">{estadisticas.notificaciones_no_leidas ?? 0}</div>
        </div>
      </div>
    </section>
  );
}