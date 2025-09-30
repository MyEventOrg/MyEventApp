export interface EventFormData {
    titulo: string;
    descripcion_corta: string;
    descripcion_larga: string;
    fecha_evento: string;
    hora: string;
    ubicacion: string;
    url_imagen: File | null;
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
