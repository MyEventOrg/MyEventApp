import React from "react";
import { Categoria } from "../(client)/crearEvento/types";

interface Props {
    categorias: Categoria[];
    value: number | undefined;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CategoriaSelector: React.FC<Props> = ({ categorias, value, onChange }) => (
    <div>
        <label className="font-semibold">Categoría del evento*</label>
        <select
            name="categoria_id"
            className="mt-2 w-full p-2 border rounded focus:outline-none"
            value={value || ""}
            onChange={onChange}
            required
        >
            <option value="" disabled>
                {categorias.length === 0 ? "Cargando categorías..." : "Selecciona una categoría"}
            </option>
            {categorias.map(cat => (
                <option key={cat.categoria_id} value={cat.categoria_id}>
                    {cat.nombre}
                </option>
            ))}
        </select>
        {categorias.length === 0 && (
            <p className="text-xs text-gray-500 mt-1">
                Las categorías se están cargando...
            </p>
        )}
    </div>
);

export default CategoriaSelector;
