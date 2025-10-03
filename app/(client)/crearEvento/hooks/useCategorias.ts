import { useEffect, useState } from "react";
import { Categoria } from "../types";
import categoriaApi from "../../../api/categoria";

export default function useCategorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const result = await categoriaApi.getCategorias();
                if (result.success && result.data) {
                    setCategorias(result.data);
                } else {
                    console.error("Error al cargar categorías:", result.message);
                    setCategorias([]);
                }
            } catch (error) {
                console.error("Error al cargar categorías:", error);
                setCategorias([]);
            }
        };

        fetchCategorias();
    }, []);
    
    return categorias;
}
