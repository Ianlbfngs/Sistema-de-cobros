import { useState } from "react";

function ProductFilters({ filters, handleFilterChange, setFilters }) {
    const [showFilters, setShowFilters] = useState(false);

    const initialFilters = {
        code: "",
        supplier: "",
        name: "",
        price: ""
    };

    const clearFilters = () => {
        setFilters(initialFilters);
    };

    return (
        <div>
            {showFilters && (
                <div>
                    <h3 className="font-semibold text-lg">Filtros</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="table-filter-label">Codigo de producto</label>
                            <input name="code" value={filters.code} onChange={handleFilterChange} className="table-filter-input" />
                        </div>

                        <div>
                            <label className="table-filter-label">Proveedor</label>
                            <input name="supplier" value={filters.supplier} onChange={handleFilterChange} className="table-filter-input" />
                        </div>

                        <div>
                            <label className="table-filter-label">Nombre producto</label>
                            <input name="name" value={filters.name} onChange={handleFilterChange} className="table-filter-input" />
                        </div>

                        <div>
                            <label className="table-filter-label">Precio</label>
                            <input name="price" value={filters.price} onChange={handleFilterChange} className="table-filter-input" />
                        </div>
                    </div>
                </div>

            )}
            <div className="flex items-center justify-between mb-4 mt-3">
                <button
                    onClick={() => setShowFilters(prev => !prev)}
                    className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" >
                    {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
                </button>
                <button
                    onClick={clearFilters}
                    className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" >
                    Limpiar filtros
                </button>
            </div>

        </div>
    );
}

export default ProductFilters;
