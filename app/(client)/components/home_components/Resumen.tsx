"use client";

import { useEffect, useState } from "react";
import { useUser } from "../../../context/userContext";
import StatsCard from "./StatsCards";
import eventoApi from "../../../api/resumen";

type Totals = { creados: number; asistiendo: number; guardados: number };

export default function ResumenPage() {
    const { user, loading: userLoading, isAuthenticated } = useUser();
    const [totals, setTotals] = useState<Totals>({ creados: 0, asistiendo: 0, guardados: 0 });
    const [loading, setLoading] = useState(true);

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
                if (resp?.ok && resp?.totals && active) {
                    setTotals(resp.totals as Totals);
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
        <div className="flex flex-wrap justify-between">
            {loading ? (
                <>
                    <div className="w-[331px] h-[114px] bg-white rounded-[20px] border border-gray-200 shadow-[0_6px_16px_rgba(0,0,0,0.08)] px-4 flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 rounded-xl bg-gray-200" />
                        <div className="flex flex-col gap-2">
                            <div className="h-3 w-24 bg-gray-200 rounded" />
                            <div className="h-6 w-12 bg-gray-200 rounded" />
                        </div>
                    </div>
                    <div className="w-[331px] h-[114px] bg-white rounded-[20px] border border-gray-200 shadow-[0_6px_16px_rgba(0,0,0,0.08)] px-4 flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 rounded-xl bg-gray-200" />
                        <div className="flex flex-col gap-2">
                            <div className="h-3 w-24 bg-gray-200 rounded" />
                            <div className="h-6 w-12 bg-gray-200 rounded" />
                        </div>
                    </div>
                    <div className="w-[331px] h-[114px] bg-white rounded-[20px] border border-gray-200 shadow-[0_6px_16px_rgba(0,0,0,0.08)] px-4 flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 rounded-xl bg-gray-200" />
                        <div className="flex flex-col gap-2">
                            <div className="h-3 w-24 bg-gray-200 rounded" />
                            <div className="h-6 w-12 bg-gray-200 rounded" />
                        </div>
                    </div>

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
                        href="/eventosAsistidos"
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

    );
}
