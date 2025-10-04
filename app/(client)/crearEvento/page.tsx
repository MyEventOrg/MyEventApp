"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NoMainHeader from "../components/NoMainHeader";
import { EventFormData } from "./types";
import CategoriaSelector from "./components/CategoriaSelector";
import ImagenUpload from "./components/ImagenUpload";
import RecursoUpload from "./components/RecursoUpload";
import UbicacionInput from "./components/UbicacionInput";
import useCategorias from "./hooks/useCategorias";
import eventoApi from "../../api/evento";
import { useUser } from "../../context/userContext";
import Aviso from "../../components/Aviso";
import uploadApi from "../../api/uploadImg";

export default function CrearEvento() {
    const router = useRouter();
    const { user } = useUser();
    const [submitting, setSubmitting] = useState(false);
    const [submitLabel, setSubmitLabel] = useState("Crear Evento");

    const [form, setForm] = useState<EventFormData>({
        titulo: "",
        descripcion_corta: "",
        descripcion_larga: "",
        fecha_evento: "",
        hora: "",
        ubicacion: "",
        url_imagen: null,
        url_recurso: null,
        tipo_evento: "publico",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);  
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);

    const categorias = useCategorias();

    // Avisos
    const [mensajeAviso, setMensajeAviso] = useState("");
    const [visible, setVisible] = useState(false);
    const [tipoAviso, setTipoAviso] = useState<"error" | "exito">("exito");
    const showAviso = (texto: string, tipo: "error" | "exito" = "exito") => {
        setMensajeAviso(texto);
        setTipoAviso(tipo);
        setVisible(true);
        setTimeout(() => setVisible(false), 3000);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const target = e.target;
        const { name, value, type } = target;

        if (type === "checkbox" && target instanceof HTMLInputElement) {
            setForm((prev) => ({ ...prev, tipo_evento: target.checked ? "privado" : "publico" }));
        } else if (type === "file" && target instanceof HTMLInputElement && name === "url_recurso") {
            const file = target.files && target.files[0];
            setForm((prev) => ({ ...prev, url_recurso: file || null }));
        } else if (name === "categoria_id") {
            const categoriaId = value ? Number(value) : undefined;
            setForm((prev) => ({ ...prev, categoria_id: categoriaId }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleUbicacionSelect = (
        lat: number,
        lng: number,
        address: string,
        ciudad?: string,
        distrito?: string
    ) => {
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (!user) {
                showAviso("Error: Usuario no autenticado. Por favor, inicia sesión.", "error");
                router.push("/login");
                return;
            }

            const required = ["titulo", "descripcion_corta", "fecha_evento", "hora", "ubicacion"] as const;
            for (const key of required) {
                if (!form[key]) {
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
            setSubmitLabel(imageFile ? "Subiendo..." : "Creando...");

            // 1) Subir imagen SOLO ahora (si hay)
            let urlImagenFinal: string | null = form.url_imagen || null;
            if (imageFile) {
                const up = await uploadApi.uploadImagen(imageFile);
                if (!up?.ok || !up?.url) {
                    showAviso("No se pudo subir la imagen. Intente nuevamente.", "error");
                    setSubmitting(false);
                    setSubmitLabel("Crear Evento");
                    return;
                }
                urlImagenFinal = up.url;
            }

            // 2) Crear evento
            setSubmitLabel("Creando...");
            const eventoData = {
                titulo: form.titulo,
                descripcion_corta: form.descripcion_corta,
                descripcion_larga: form.descripcion_larga || "",
                fecha_evento: form.fecha_evento,
                hora: form.hora,
                tipo_evento: form.tipo_evento,
                ubicacion: form.ubicacion,
                latitud: form.latitud?.toString(),
                longitud: form.longitud?.toString(),
                ciudad: form.ciudad || "",
                distrito: form.distrito || "",
                categoria_id: form.categoria_id || null,
                usuario_id: user.usuario_id,
                url_imagen: urlImagenFinal,
                url_recurso: form.url_recurso || null,
            };

            const result = await eventoApi.createEvento(eventoData);

            if (result.success) {
                localStorage.setItem("EventCreadoExito", "Evento creado correctamente");
                setTimeout(() => router.push("/"), 800);
            } else {
                showAviso(result.message || "Error desconocido", "error");
                setSubmitting(false);
                setSubmitLabel("Crear Evento");
            }
        } catch (error) {
            console.error("Error al crear evento:", error);
            showAviso("Error inesperado al crear el evento. Intente nuevamente.", "error");
            setSubmitting(false);
            setSubmitLabel("Crear Evento");
        }
    };

    return (
        <>
            <NoMainHeader title="Crear Evento" />
            <main className="px-12 py-8 flex justify-center items-center min-h-[90vh] bg-[#F6F6F6]">
                <form
                    className="bg-white rounded-xl shadow-md p-8 w-full max-w-xl flex flex-col gap-6 border border-bordergray"
                    onSubmit={handleSubmit}
                >
                    {/* nombre */}
                    <div>
                        <label className="font-semibold">Nombre del Evento*</label>
                        <input
                            type="text"
                            name="titulo"
                            placeholder="Ej: Conferencia de Tecnologia 2024"
                            className="mt-2 w-full p-2 border rounded focus:outline-none"
                            value={form.titulo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* descripción corta */}
                    <div>
                        <label className="font-semibold">Descripción Corta*</label>
                        <textarea
                            name="descripcion_corta"
                            placeholder="Describe tu evento en detalle..."
                            className="mt-2 w-full p-2 border rounded focus:outline-none"
                            value={form.descripcion_corta}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* descripción larga */}
                    <div>
                        <label className="font-semibold">Descripcion Larga*</label>
                        <textarea
                            name="descripcion_larga"
                            placeholder="Describe tu evento..."
                            className="mt-2 w-full p-2 border rounded focus:outline-none"
                            value={form.descripcion_larga}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* fecha / hora */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="font-semibold">Fecha*</label>
                            <input
                                type="date"
                                name="fecha_evento"
                                className="mt-2 w-full p-2 border rounded focus:outline-none"
                                value={form.fecha_evento}
                                onChange={handleChange}
                                min={new Date().toISOString().split("T")[0]}
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="font-semibold">Hora*</label>
                            <input
                                type="time"
                                name="hora"
                                className="mt-2 w-full p-2 border rounded focus:outline-none"
                                value={form.hora}
                                onChange={handleChange}
                                required
                                min={
                                    form.fecha_evento === new Date().toISOString().split("T")[0]
                                        ? new Date().toTimeString().slice(0, 5)
                                        : undefined
                                }
                            />
                        </div>
                    </div>

                    {/* ubicación */}
                    <UbicacionInput
                        value={form.ubicacion}
                        position={selectedPosition}
                        onChange={handleChange}
                        onSelect={handleUbicacionSelect}
                    />

                    {/* imagen (NO sube en onChange) */}
                    <ImagenUpload
                        value={imgPreview || form.url_imagen}
                        onFileSelect={(file, preview) => {
                            setImageFile(file);
                            setImgPreview(preview);
                        }}
                        required
                    />

                    {/* categoría */}
                    <CategoriaSelector
                        categorias={categorias}
                        value={form.categoria_id}
                        onChange={handleChange}
                    />

                    {/* público/privado */}
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
                        <span className="ml-2 text-gray-400">{form.tipo_evento === "privado" ? "🔒" : ""}</span>
                    </div>

                    {/* recurso */}
                    <RecursoUpload value={form.url_recurso ?? null} onChange={handleChange} />

                    {/* guía */}
                    <div className="bg-gray-100 rounded p-4 text-sm border border-gray-300">
                        <div className="font-semibold mb-2">Información sobre privacidad:</div>
                        <div><b>Eventos públicos:</b> Visibles para todos los usuarios, pueden ser guardados como favoritos.</div>
                        <div><b>Eventos privados:</b> Solo visibles para invitados, acceso por invitación</div>
                        <div>Los eventos públicos tienen un límite de 100 asistentes</div>
                        <div>Los eventos privados no tienen límite de asistentes</div>
                    </div>

                    {/* botones */}
                    <div className="flex gap-4 mt-4">
                        <button
                            type="button"
                            className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400"
                            onClick={() => router.push("/")}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            aria-busy={submitting}
                            className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700
              ${submitting ? "opacity-60 cursor-not-allowed hover:bg-blue-600" : "cursor-pointer"}`}
                        >
                            <span className="inline-flex items-center gap-2">
                                {submitting && (
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
                                    </svg>
                                )}
                                {submitLabel}
                            </span>
                        </button>
                    </div>
                </form>
            </main>

            <Aviso mensaje={mensajeAviso} visible={visible} tipo={tipoAviso} />
        </>
    );
}
