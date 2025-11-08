import React from "react";

interface EliminarCuentaProps {
  onDelete: () => void;
}

const EliminarCuenta: React.FC<EliminarCuentaProps> = ({ onDelete }) => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <section className="bg-red-100 border border-red-200 rounded-xl shadow p-6 mt-10">
      <h2 className="text-base font-semibold text-red-700 mb-2">Acciones peligrosas</h2>
      <p className="text-sm text-red-700 mb-3">Estas acciones son irreversibles. Ten cuidado al proceder</p>
      <button
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold text-sm shadow"
        onClick={() => setShowModal(true)}
      >
        {/* Icono tacho de basura */}
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12zM10 11v6m4-6v6" />
        </svg>
        Eliminar cuenta
      </button>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', zIndex: 0 }} />
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full" style={{ zIndex: 1, position: 'relative' }}>
            <h3 className="text-lg font-bold mb-4 text-red-600">¿Estás seguro de eliminar tu cuenta?</h3>
            <p className="mb-6">Esta acción es irreversible. Todos tus datos y eventos asociados se eliminarán permanentemente.</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-bold"
                onClick={() => { setShowModal(false); onDelete(); }}
              >
                Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EliminarCuenta;