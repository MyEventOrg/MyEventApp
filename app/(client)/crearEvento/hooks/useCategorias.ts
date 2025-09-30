import { useEffect, useState } from "react";
import { Categoria } from "../types";

export default function useCategorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    useEffect(() => {
        fetch("/api/categoria")
            .then(res => res.ok ? res.json() : [])
            .then(setCategorias);
    }, []);
    return categorias;
}
