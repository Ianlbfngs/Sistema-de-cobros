import { useState } from "react";

function SalesFilters({ filters, handleFilterChange, setFilters }) {
    const [showFilters, setShowFilters] = useState(false);

    const initialFilters = {
        id: "",
        userId: "",
        storeName: "",
        email: "",
        method: "",
        total: "",
        dateTime: "",
        status: ""
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
                            <label className="table-filter-label">Id de la Venta</label>
                            <input name="id" value={filters.id} onChange={handleFilterChange} className="table-filter-input"/>
                        </div>

                        <div>
                            <label className="table-filter-label">Id del usuario</label>
                            <input name="userId" value={filters.userId} onChange={handleFilterChange} className="table-filter-input"/>
                        </div>

                        <div>
                            <label className="table-filter-label">Nombre del local</label>
                            <input name="storeName" value={filters.storeName} onChange={handleFilterChange} className="table-filter-input"/>
                        </div>

                        <div>
                            <label className="table-filter-label">Mail del cliente</label>
                            <input name="email" value={filters.email} onChange={handleFilterChange} className="table-filter-input"/>
                        </div>

                        <div>
                            <label className="table-filter-label">Método de pago</label>
                            <select name="method" value={filters.method} onChange={handleFilterChange} className="table-filter-input">
                                <option value="">Todos</option>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Credito">Crédito</option>
                                <option value="Debito">Débito</option>
                                <option value="Transferencia">Transferencia</option>
                            </select>
                        </div>

                        <div>
                            <label className="table-filter-label">Total</label>
                            <input name="total" value={filters.total} onChange={handleFilterChange} className="table-filter-input"/>
                        </div>

                        <div>
                            <label className="table-filter-label">Fecha</label>
                            <input type="date" name="dateTime" value={filters.dateTime} onChange={handleFilterChange} className="table-filter-input"/>
                        </div>

                        <div>
                            <label className="table-filter-label">Estatus</label>
                            <select name="status" value={filters.status} onChange={handleFilterChange} className="table-filter-input">
                                <option value="">Todos</option>
                                <option value="FACTURADA">Facturada</option>
                                <option value="PENDIENTE">Pendiente de pago</option>
                            </select>
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

export default SalesFilters;
