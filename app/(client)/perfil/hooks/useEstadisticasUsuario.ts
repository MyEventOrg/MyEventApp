import { useEffect, useState } from "react";
import { useUser } from "../../../context/userContext";
import eventoApi from "../../../api/resumen";

export type EstadisticasUsuario = {
  eventos_creados: number;
  eventos_asistidos: number;
  eventos_guardados: number;
  notificaciones_no_leidas?: number;
};

export function useEstadisticasUsuario() {
  const { user, loading: userLoading, isAuthenticated } = useUser();
  const [estadisticas, setEstadisticas] = useState<EstadisticasUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userLoading) return;
    if (!isAuthenticated || !user?.usuario_id) {
      setEstadisticas(null);
      setLoading(false);
      return;
    }

    let mounted = true;
    
    const fetchEstadisticas = async () => {
      try {
        setLoading(true);
        const response = await eventoApi.getResumenMisEventos(user.usuario_id);
        
        if (mounted && response?.success && response.data?.totals) {
          const stats: EstadisticasUsuario = {
            eventos_creados: response.data.totals.creados,
            eventos_asistidos: response.data.totals.asistiendo,
            eventos_guardados: response.data.totals.guardados,
            notificaciones_no_leidas: 1, // Valor estático temporal hasta implementar notificaciones
          };
          setEstadisticas(stats);
          setError(null);
        } else if (mounted) {
          setError("No se pudieron obtener las estadísticas");
        }
      } catch (err: any) {
        if (mounted) {
          console.error("Error cargando estadísticas:", err);
          setError("Error de conexión al cargar estadísticas");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchEstadisticas();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user?.usuario_id, userLoading]);

  return { estadisticas, loading, error };
}