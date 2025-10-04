"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, MapPin, Users2, Eye } from "lucide-react";
import eventoApi from "../../../api/resumen";
import EventCard, { EventoBase, EventoWithRol } from "./EventCard";

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

const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
};

export default function UpcomingCarousel({ usuarioId }: { usuarioId: number }) {
    const [items, setItems] = useState<(Evento & { rol: "organizador" | "asistente" })[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                setLoading(true);
                const resp = await eventoApi.getResumenMisEventos(usuarioId);
                const creados: Evento[] = resp?.data?.eventosCreados ?? [];
                const asist: Evento[] = resp?.data?.eventosAsistiendo ?? [];

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

                const top9 = ordenados.slice(0, 9);
                if (active) { setItems(top9); setPage(0); }
            } catch (e) {
                console.error(e);
                if (active) setItems([]);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => { active = false; };
    }, [usuarioId]);

    const pages = useMemo(() => {
        const chunks: typeof items[] = [];
        for (let i = 0; i < items.length; i += 3) chunks.push(items.slice(i, i + 3));
        return chunks;
    }, [items]);

    const totalPages = pages.length || 0;

    const go = (dir: 1 | -1) => {
        if (!totalPages) return;
        setDirection(dir);
        setPage((p) => {
            const next = p + dir;
            if (next < 0) return 0;
            if (next > totalPages - 1) return totalPages - 1;
            return next;
        });
    };

    const Dots = () => {
        const count = 3;
        return (
            <div className="mt-4 w-full flex justify-end pr-3">
                <div className="flex items-center gap-2">
                    {Array.from({ length: count }).map((_, i) => {
                        const active = page === i;
                        const disabled = i >= totalPages;
                        return (
                            <motion.button
                                key={i}
                                onClick={() => {
                                    if (disabled) return;
                                    setDirection(i > page ? 1 : -1);
                                    setPage(i);
                                }}
                                aria-label={`Ir a la página ${i + 1}`}
                                aria-current={active ? "page" : undefined}
                                className={`relative w-3 h-3 rounded-full ${disabled ? "opacity-40 pointer-events-none" : ""}`}
                                whileTap={{ scale: disabled ? 1 : 0.9 }}
                            >
                                <span className="absolute inset-0 rounded-full bg-gray-300" />
                                {active && (
                                    <motion.span
                                        layoutId="dot-active"
                                        className="absolute inset-0 rounded-full bg-gray-700"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            <div className="w-full flex items-stretch gap-3">
                <div className="w-[36px] flex items-center justify-center">
                    <button
                        aria-label="Anterior"
                        onClick={() => go(-1)}
                        disabled={page === 0}
                        className="rounded-full bg-white border border-gray-200 shadow p-2 disabled:opacity-40"
                    >
                        ‹
                    </button>
                </div>
                <div className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="w-full h-[340px] bg-white rounded-2xl border border-gray-200 shadow-[0_6px_16px_rgba(0,0,0,0.08)] p-4 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : totalPages === 0 ? (
                        <div className="text-sm text-gray-500 p-4">No hay eventos para mostrar.</div>
                    ) : (
                        <AnimatePresence custom={direction} initial={false} mode="popLayout">
                            <motion.div
                                key={page}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.6 }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                    {pages[page]?.map((e) => (
                                        <EventCard key={e.evento_id} event={e as EventoWithRol} />
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
                <div className="w-[36px] flex items-center justify-center">
                    <button
                        aria-label="Siguiente"
                        onClick={() => go(1)}
                        disabled={page >= totalPages - 1}
                        className="rounded-full bg-white border border-gray-200 shadow p-2 disabled:opacity-40"
                    >
                        ›
                    </button>
                </div>
            </div>
            {totalPages > 0 && (
                <div className="mt-2 w-full flex justify-end pr-3">
                    <div className="flex items-center gap-2">
                        {Array.from({ length: 3 }).map((_, i) => {
                            const active = page === i;
                            const disabled = i >= totalPages;
                            return (
                                <motion.button
                                    key={i}
                                    onClick={() => {
                                        if (disabled) return;
                                        setDirection(i > page ? 1 : -1);
                                        setPage(i);
                                    }}
                                    aria-label={`Ir a la página ${i + 1}`}
                                    aria-current={active ? "page" : undefined}
                                    className={`relative w-3 h-3 rounded-full ${disabled ? "opacity-40 pointer-events-none" : ""}`}
                                    whileTap={{ scale: disabled ? 1 : 0.9 }}
                                >
                                    <span className="absolute inset-0 rounded-full bg-gray-300" />
                                    {active && (
                                        <motion.span
                                            layoutId="dot-active"
                                            className="absolute inset-0 rounded-full bg-gray-700"
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
