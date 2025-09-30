import React from "react";
import { Categoria } from "../types";

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
            <option value="" disabled>Selecciona una categoría</option>
            {categorias.map(cat => (
                <option key={cat.categoria_id} value={cat.categoria_id}>{cat.nombre}</option>
            ))}
        </select>
    </div>
);

export default CategoriaSelector;
