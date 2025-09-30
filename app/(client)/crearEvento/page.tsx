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

export default function CrearEvento() {
    const router = useRouter();
    const [form, setForm] = useState<EventFormData>({
        titulo: "",
        descripcion_corta: "",
        descripcion_larga: "",
        fecha_evento: "",
        hora: "",
        ubicacion: "",
        url_imagen: null,
        tipo_evento: "publico",
    });

    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const [selectedPosition, setSelectedPosition] = useState<{lat: number, lng: number} | null>(null);
    const categorias = useCategorias();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, value, type } = target;
        if (type === "checkbox" && target instanceof HTMLInputElement) {
            setForm((prev) => ({ ...prev, tipo_evento: target.checked ? "privado" : "publico" }));
        } else if (type === "file" && target instanceof HTMLInputElement) {
            const file = target.files && target.files[0];
            if (name === "url_imagen" && file) {
                setForm((prev) => ({ ...prev, url_imagen: file }));
                setImgPreview(URL.createObjectURL(file));
            } else if (name === "url_recurso" && file) {
                setForm((prev) => ({ ...prev, url_recurso: file }));
            }
        } else if (type === "select-one") {
            setForm((prev) => ({ ...prev, categoria_id: Number(value) }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Ubicacion
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


    // Facade para el formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // campos obligatorios
        const required = ["titulo", "descripcion_corta", "descripcion_larga", "fecha_evento", "hora", "ubicacion", "url_imagen", "categoria_id", "latitud", "longitud"];
        for (const key of required) {
            if (!form[key as keyof EventFormData]) {
                alert("Todos los campos obligatorios deben estar completos.");
                return;
            }
        }
        // Crear FormData
        const fd = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (value instanceof File) {
                    fd.append(key, value);
                } else {
                    fd.append(key, value.toString());
                }
            }
        });
        // Envio al back
        const res = await fetch("/api/evento", {
            method: "POST",
            body: fd,
        });
        const data = await res.json();
        if (data.success) {
            alert("Evento creado correctamente.");
        } else {
            alert("Error al crear evento: " + (data.error || ""));
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
                    {/* descrip corta */}
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
                    {/* descrip larga*/}
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
                                min={form.fecha_evento === new Date().toISOString().split("T")[0] ? new Date().toTimeString().slice(0,5) : undefined}
                            />
                        </div>
                    </div>
                    {/* campo de ubicacion */}
                    <UbicacionInput
                        value={form.ubicacion}
                        position={selectedPosition}
                        onChange={handleChange}
                        onSelect={handleUbicacionSelect}
                    />
                    {/* Imagen */}
                    <ImagenUpload
                        value={form.url_imagen}
                        onChange={handleChange}
                        preview={imgPreview}
                    />
                    {/* categoria */}
                    <CategoriaSelector
                        categorias={categorias}
                        value={form.categoria_id}
                        onChange={handleChange}
                    />
                    {/* publico/privado */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="tipo_evento"
                            checked={form.tipo_evento === "privado"}
                            onChange={handleChange}
                            id="privadoCheck"
                        />
                        <label htmlFor="privadoCheck" className="font-semibold">Evento privado</label>
                        <span className="ml-2 text-gray-400">{form.tipo_evento === "privado" ? "🔒" : ""}</span>
                    </div>
                    {/* Recurso */}
                    <RecursoUpload
                        value={form.url_recurso ?? null}
                        onChange={handleChange}
                    />
                    {/* Guia */}
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
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            Crear Evento
                        </button>
                    </div>
                </form>
            </main>
        </>
    );
}
