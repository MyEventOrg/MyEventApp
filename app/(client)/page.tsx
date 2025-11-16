"use client";

import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import StatsCard from "../components/StatsCard";
import Aviso from "../components/Aviso";
import eventoApi from "../api/resumen";
import EventCard, { EventoWithRol } from "../components/EventCard";

type Totals = { creados: number; asistiendo: number; guardados: number };

type Evento = {
  evento_id: number;
  titulo: string;
  descripcion_corta: string;
  fecha_evento: string;
  hora: string | null;
  tipo_evento: string;
  ubicacion: string | null;
  ciudad?: string | null;
  distrito?: string | null;
  estado_evento?: string;
};

function toDateLocal(fecha: string, hora?: string | null) {
  const [y, m, d] = fecha.split("-").map(Number);
  const [hh, mm] = (hora ?? "00:00").split(":").map((v) => Number(v || 0));
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
}

function dedupeById<T extends { evento_id: number }>(arr: T[]) {
  const s = new Set<number>();
  return arr.filter((e) => (s.has(e.evento_id) ? false : (s.add(e.evento_id), true)));
}

export default function Home() {
  const [mensajeAviso, setMensajeAviso] = useState("");
  const [visible, setVisible] = useState(false);
  const [tipo, setTipo] = useState<"error" | "exito">("exito");

  const showAviso = (texto: string, tipo: "error" | "exito" = "exito") => {
    setMensajeAviso(texto);
    setTipo(tipo);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  };

  useEffect(() => {
    const msg = localStorage.getItem("EventCreadoExito");
    if (msg) {
      showAviso(msg, "exito");
      localStorage.removeItem("EventCreadoExito");
    }
  }, []);

  useEffect(() => {
    const msg = localStorage.getItem("eventoActualizadoExito");
    if (msg) {
      showAviso(msg, "exito");
      localStorage.removeItem("eventoActualizadoExito");
    }
  }, []);

  useEffect(() => {
    const msg = localStorage.getItem("eventoBorrado");
    if (msg) {
      showAviso(msg, "exito");
      localStorage.removeItem("eventoBorrado");
    }
  }, []);

  const { user, loading: userLoading, isAuthenticated } = useUser();
  const [totals, setTotals] = useState<Totals>({ creados: 0, asistiendo: 0, guardados: 0 });
  const [loading, setLoading] = useState(true);
  const [proxEventos, setProxEventos] = useState<(Evento & { rol: "organizador" | "asistente" })[]>([]);

  useEffect(() => {
    if (userLoading) return;
    if (!isAuthenticated || !user?.usuario_id) {
      setLoading(false);
      return;
    }

    let active = true;
    (async () => {
      try {
        setLoading(true);
        const resp = await eventoApi.getResumenMisEventos(user.usuario_id);
        if (!resp?.success || !resp.data) return;

        if (active) {
          setTotals(resp.data.totals);

          const creados = resp.data.data.eventosCreados ?? [];
          const asist = resp.data.data.eventosAsistiendo ?? [];

          const merged = dedupeById([
            ...creados.map((e) => ({ ...e, rol: "organizador" as const })),
            ...asist.map((e) => ({ ...e, rol: "asistente" as const })),
          ]);

          const activos = merged.filter((e: any) => !("estado_evento" in e) || e.estado_evento === "activo");


          const now = new Date();
          const ordenados = activos.sort((a, b) => {
            const da = toDateLocal(a.fecha_evento, a.hora).getTime();
            const db = toDateLocal(b.fecha_evento, b.hora).getTime();
            const aFuture = da >= now.getTime();
            const bFuture = db >= now.getTime();
            if (aFuture && !bFuture) return -1;
            if (!aFuture && bFuture) return 1;
            if (aFuture && bFuture) return da - db;
            return db - da;
          });

          setProxEventos(ordenados.slice(0, 3));
        }
      } catch (e) {
        console.error("Error cargando resumen:", e);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [isAuthenticated, user?.usuario_id, userLoading]);

  return (
    <>
      <Aviso mensaje={mensajeAviso} visible={visible} tipo={tipo} />

      <div className="flex flex-wrap justify-between">
        {loading ? (
          <>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-[331px] h-[114px] bg-white rounded-[20px] border border-gray-200 shadow-[0_6px_16px_rgba(0,0,0,0.08)] px-4 flex items-center gap-3 animate-pulse"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-200" />
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-6 w-12 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Mis Eventos"
              value={totals.creados}
              icon="calendar"
              href="/misEventos"
              numberClass="text-gray-900"
              iconClass="text-indigo-700"
            />
            <StatsCard
              title="Asistiendo"
              value={totals.asistiendo}
              icon="users"
              href="/misAsistencias"
              numberClass="text-green-600"
              iconClass="text-green-500"
            />
            <StatsCard
              title="Guardados"
              value={totals.guardados}
              icon="megaphone"
              href="/eventosGuardados"
              numberClass="text-yellow-600"
              iconClass="text-yellow-500"
            />
          </>
        )}
      </div>

      <div className="flex flex-col mt-12 items-start gap-3 bg-white rounded-[20px] border border-gray-200 shadow-[0_6px_16px_rgba(0,0,0,0.08)] px-8 py-4">
        <h1 className="text-2xl">Próximos eventos</h1>
        {!isAuthenticated || !user?.usuario_id ? (
          <div className="text-sm text-gray-500">
            Inicia sesión para ver tus próximos eventos.
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-full h-[340px] bg-white rounded-2xl border border-gray-200 shadow-[0_6px_16px_rgba(0,0,0,0.08)] p-4 animate-pulse"
              />
            ))}
          </div>
        ) : proxEventos.length === 0 ? (
          <div className="text-sm text-gray-500 p-4">No hay eventos para mostrar.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {proxEventos.map((e) => (
              <EventCard key={e.evento_id} event={e as EventoWithRol} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
