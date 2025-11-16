"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import NoMainHeader from "../../../components/NoMainHeader";
import CategoriaSelector from "../../../components/CategoriaSelector";
import ImagenUpload from "../../../components/ImagenUpload";
import RecursoUpload from "../../../components/RecursoUpload";
import UbicacionInput from "../../../components/UbicacionInput";

import eventoApi from "../../../api/evento";
import uploadApi from "../../../api/uploadImg";
import categoriaApi from "../../../api/categoria";

import { useUser } from "../../../context/userContext";
import Aviso from "../../../components/Aviso";

export interface EventFormData {
    titulo: string;
    descripcion_corta: string;
    descripcion_larga: string;
    ubicacion: string;
    url_imagen: string | null;
    tipo_evento: string;
    latitud?: number;
    longitud?: number;
    ciudad?: string;
    distrito?: string;
    categoria_id?: number;
    url_recurso?: File | null;
}

export interface Categoria {
    categoria_id: number;
    nombre: string;
}

export default function EditarEvento() {
    const router = useRouter();
    const { id } = useParams();
    const { user, loading: userLoading, isAuthenticated } = useUser();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitLabel, setSubmitLabel] = useState("Guardar Cambios");

    const [form, setForm] = useState<EventFormData>({
        titulo: "",
        descripcion_corta: "",
        descripcion_larga: "",
        ubicacion: "",
        url_imagen: null,
        tipo_evento: "publico",
        url_recurso: null,
    });

    // 🔥 NUEVO: Copia del formulario original
    const [originalForm, setOriginalForm] = useState<EventFormData | null>(null);

    const [hayCambios, setHayCambios] = useState(false);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);

    const [categorias, setCategorias] = useState<Categoria[]>([]);

    const [mensajeAviso, setMensajeAviso] = useState("");
    const [visible, setVisible] = useState(false);
    const [tipoAviso, setTipoAviso] = useState<"error" | "exito">("exito");
    const [errorCarga, setErrorCarga] = useState<string | null>(null);

    const showAviso = (msg: string, tipo: "error" | "exito" = "exito") => {
        setMensajeAviso(msg);
        setTipoAviso(tipo);
        setVisible(true);
        setTimeout(() => setVisible(false), 3000);
    };

    // ================================================================
    //  CARGAR CATEGORÍAS
    // ================================================================
    useEffect(() => {
        categoriaApi.getCategorias().then((result) => {
            if (result.success) setCategorias(result.data);
        });
    }, []);

    // ================================================================
    //  CARGAR EVENTO PARA EDITAR
    // ================================================================
    useEffect(() => {
        if (userLoading) return;

        if (!isAuthenticated || !user?.usuario_id) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const res = await eventoApi.getEventoByIdEditar(Number(id), user.usuario_id);

                if (!res.success || !res.data) {
                    setErrorCarga(res.message || "No autorizado");
                    setLoading(false);
                    return;
                }

                const ev = res.data;

                const parsed = {
                    titulo: ev.titulo,
                    descripcion_corta: ev.descripcion_corta,
                    descripcion_larga: ev.descripcion_larga ?? "",
                    ubicacion: ev.ubicacion ?? "",
                    url_imagen: ev.url_imagen ?? null,
                    tipo_evento: ev.tipo_evento,
                    latitud: ev.latitud ? Number(ev.latitud) : undefined,
                    longitud: ev.longitud ? Number(ev.longitud) : undefined,
                    ciudad: ev.ciudad ?? "",
                    distrito: ev.distrito ?? "",
                    categoria_id: ev.categoria_id ?? undefined,
                    url_recurso: null,
                };

                setForm(parsed);
                setOriginalForm(parsed); // 🔥 Guardamos el formulario original

                if (ev.latitud && ev.longitud) {
                    setSelectedPosition({ lat: Number(ev.latitud), lng: Number(ev.longitud) });
                }

                setImgPreview(ev.url_imagen ?? null);
            } catch (err) {
                console.error(err);
                showAviso("No se pudo cargar el evento", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userLoading, isAuthenticated, id]);

    // ================================================================
    // 🔥 DETECTAR CAMBIOS AUTOMÁTICAMENTE
    // ================================================================
    useEffect(() => {
        if (!originalForm) return;

        const formChanged =
            JSON.stringify({ ...form, url_recurso: null }) !==
            JSON.stringify({ ...originalForm, url_recurso: null });

        const imageChanged = imageFile !== null; // 🔥 si hay nueva imagen, es un cambio

        setHayCambios(formChanged || imageChanged);
    }, [form, originalForm, imageFile]);


    // ================================================================
    // MANEJO INPUTS
    // ================================================================
    const handleChange = (e: any) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            setForm((prev) => ({
                ...prev,
                tipo_evento: e.target.checked ? "privado" : "publico",
            }));
            return;
        }

        if (type === "file" && name === "url_recurso") {
            const file = e.target.files?.[0] || null;
            setForm((prev) => ({ ...prev, url_recurso: file }));
            return;
        }

        if (name === "categoria_id") {
            setForm((prev) => ({ ...prev, categoria_id: Number(value) || undefined }));
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleUbicacionSelect = (lat: number, lng: number, address: string, ciudad?: string, distrito?: string) => {
        setSelectedPosition({ lat, lng });
        setForm((prev) => ({
            ...prev,
            ubicacion: address,
            latitud: lat,
            longitud: lng,
            ciudad,
            distrito,
        }));
    };

    // ================================================================
    //  SUBMIT - ACTUALIZAR EVENTO
    // ================================================================
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!hayCambios) {
            showAviso("No hay cambios para guardar.", "error");
            return;
        }

        try {
            if (!user) {
                showAviso("No autenticado", "error");
                router.push("/login");
                return;
            }

            // VALIDACIONES (las de tu versión actual)
            const required = ["titulo", "descripcion_corta", "descripcion_larga", "ubicacion"] as const;
            for (const key of required) {
                if (!form[key] || String(form[key]).trim() === "") {
                    const label = key.replace("_", " ");
                    showAviso(`El campo ${label} es obligatorio.`, "error");
                    return;
                }
            }

            if (!form.latitud || !form.longitud) {
                showAviso("Debe seleccionar una ubicación válida en el mapa.", "error");
                return;
            }

            setSubmitting(true);
            setSubmitLabel("Guardando...");

            // Subir imagen si hay nueva
            let urlImagenFinal = form.url_imagen;
            if (imageFile) {
                const up = await uploadApi.uploadImagen(imageFile);
                if (!up?.ok || !up?.url) {
                    showAviso("Error al subir imagen", "error");
                    setSubmitting(false);
                    return;
                }
                urlImagenFinal = up.url;
            }

            const payload = {
                ...form,
                url_imagen: urlImagenFinal,
            };

            const result = await eventoApi.updateEvento(Number(id), payload);

            if (!result.success) {
                showAviso(result.message || "Error al actualizar evento", "error");
                setSubmitting(false);
                return;
            }

            localStorage.setItem("eventoActualizadoExito", "Evento actualizado correctamente");
            router.push("/");

        } catch (err) {
            console.error(err);
            showAviso("Error inesperado", "error");
        } finally {
            setSubmitting(false);
            setSubmitLabel("Guardar Cambios");
        }
    };

    // ================================================================
    // RENDER
    // ================================================================

    if (errorCarga) {
        return (
            <>
                <NoMainHeader title="Editar Evento" />
                <main className="w-full min-h-[70vh] flex flex-col p-8">
                    <div className="bg-red-100 text-red-600 border border-red-300 px-6 py-4 rounded-lg shadow max-w-md">
                        <h2 className="text-xl font-semibold mb-1">Error</h2>
                        <p>{errorCarga}</p>
                    </div>
                </main>
            </>
        );
    }

    if (loading) {
        return (
            <main className="w-full flex justify-center items-center min-h-screen">
                <p className="text-gray-600 text-lg animate-pulse">Cargando evento...</p>
            </main>
        );
    }

    return (
        <>
            <NoMainHeader title="Editar Evento" />

            <main className="px-12 py-8 flex justify-center items-center min-h-[90vh] bg-[#F6F6F6]">
                <form
                    className="bg-white rounded-xl shadow-md p-8 w-full max-w-xl flex flex-col gap-6 border border-bordergray"
                    onSubmit={handleSubmit}
                >
                    {/* Nombre */}
                    <div>
                        <label className="font-semibold">Nombre del Evento*</label>
                        <input
                            type="text"
                            name="titulo"
                            value={form.titulo}
                            onChange={handleChange}
                            className="mt-2 w-full p-2 border rounded"
                            required
                        />
                    </div>

                    {/* Descripción corta */}
                    <div>
                        <label className="font-semibold">Descripción Corta*</label>
                        <textarea
                            name="descripcion_corta"
                            value={form.descripcion_corta}
                            onChange={handleChange}
                            className="mt-2 w-full p-2 border rounded h-20 resize-none"
                            required
                        />
                    </div>

                    {/* Descripción larga */}
                    <div>
                        <label className="font-semibold">Descripción Larga*</label>
                        <textarea
                            name="descripcion_larga"
                            value={form.descripcion_larga}
                            onChange={handleChange}
                            className="mt-2 w-full p-2 border rounded h-32 resize-none"
                            required
                        />
                    </div>
                    {/* Ubicación */}
                    <UbicacionInput
                        value={form.ubicacion}
                        position={selectedPosition}
                        onChange={handleChange}
                        onSelect={handleUbicacionSelect}
                    />

                    {/* Imagen */}
                    <ImagenUpload
                        value={imgPreview || form.url_imagen}
                        onFileSelect={(file, preview) => {
                            setImageFile(file);
                            setImgPreview(preview);
                        }}
                    />

                    {/* Categoría */}
                    <CategoriaSelector
                        categorias={categorias}
                        value={form.categoria_id}
                        onChange={handleChange}
                    />

                    {/* Privado / Público */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="tipo_evento"
                            checked={form.tipo_evento === "privado"}
                            onChange={handleChange}
                            id="privadoCheck"
                        />
                        <label htmlFor="privadoCheck" className="font-semibold">
                            Evento privado
                        </label>
                    </div>

                    {/* PDF */}
                    <RecursoUpload value={form.url_recurso ?? null} onChange={handleChange} />

                    {/* Botones */}
                    <div className="flex gap-4 mt-4">
                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={submitting || !hayCambios}
                            className={`px-6 py-2 rounded text-white 
                                ${!hayCambios || submitting
                                    ? "bg-blue-400 opacity-60 "
                                    : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                }`}
                        >
                            {submitLabel}
                        </button>
                    </div>
                </form>
            </main>

            <Aviso mensaje={mensajeAviso} visible={visible} tipo={tipoAviso} />
        </>
    );
}
