"use client";

type Props = {
    open: boolean;
    notificaciones: any[];
    onClickNotificacion: (id: number) => void;
};

export default function Notificaciones({ open, notificaciones, onClickNotificacion }: Props) {

    const formatFecha = (fechaStr: string) => {
        if (!fechaStr) return "Sin fecha";
        const fecha = new Date(fechaStr);
        if (isNaN(fecha.getTime())) return "Fecha inválida";

        return fecha.toLocaleString("es-PE", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div
            className={`
        absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 transition-all duration-300 ease-out
        ${open
                    ? "max-h-[70vh] opacity-100 pointer-events-auto visible"
                    : "max-h-0 opacity-0 pointer-events-none invisible"
                }
    `}
        >

            <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                    Notificaciones
                </h3>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-4 py-3 space-y-3">

                {notificaciones.map((n) => (
                    <div
                        key={n.notificacion_id}
                        onClick={() => onClickNotificacion(n.notificacion_id)}
                        className={`
                            rounded-md p-4 border cursor-pointer transition
                            ${!n.visto
                                ? "bg-blue-100 border-blue-500 shadow-md"
                                : "bg-gray-50 border-gray-200"
                            }
                        `}
                    >
                        <p className="text-sm text-gray-800">{n.mensaje}</p>

                        <p className="text-xs text-gray-500 mt-1">
                            {formatFecha(n.fecha_creacion)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
