import { useState } from "react";

function CashRegisterFilters({ filters, handleFilterChange, setFilters }) {
    const [showFilters, setShowFilters] = useState(false);

    const initialFilters = {
        id: "",
        storeName: "",
        openDate: "",
        openUser: "",
        closeDate: "",
        closeUser: "",
        status: "",
        audit: ""
    };

    const clearFilters = () => {
        setFilters(initialFilters);
    };

    return (
        <div>

            {showFilters && (
                <div>
                    <h3 className="font-semibold text-lg ">Filtros</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="table-filter-label">Id de la caja</label>
                            <input name="id" value={filters.id} onChange={handleFilterChange} className="table-filter-input" />
                        </div>
                        <div>
                            <label className="table-filter-label">Local</label>
                            <input name="storeName" value={filters.storeName} onChange={handleFilterChange} className="table-filter-input" />
                        </div>
                        <div>
                            <label className="table-filter-label">Fecha de apertura</label>
                            <input type="date" name="openDate" value={filters.openDate} onChange={handleFilterChange} className="table-filter-input" />
                        </div>
                        <div>
                            <label className="table-filter-label">Usuario de apertura</label>
                            <input name="openUser" value={filters.openUser} onChange={handleFilterChange} className="table-filter-input" />
                        </div>
                        <div>
                            <label className="table-filter-label">Fecha de cierre</label>
                            <input type="date" name="closeDate" value={filters.closeDate} onChange={handleFilterChange} className="table-filter-input" />
                        </div>
                        <div>
                            <label className="table-filter-label">Usuario de cierre</label>
                            <input name="closeUser" value={filters.closeUser} onChange={handleFilterChange} className="table-filter-input" />
                        </div>

                        <div>
                            <label className="table-filter-label">Estado de auditoria</label>
                            <select name="audit" value={filters.audit} onChange={handleFilterChange} className="table-filter-input">
                                <option value="">Seleccione el estado de la auditoria</option>
                                <option value="CONSISTENT">Consistente</option>
                                <option value="INCONSISTENT">Inconsistente</option>
                            </select>
                        </div>
                        <div>
                            <label className="table-filter-label">Estado de caja</label>
                            <select name="status" value={filters.status} onChange={handleFilterChange} className="table-filter-input">
                                <option value="">Seleccione el estado de la caja</option>
                                <option value="Cerrada">Cerrada</option>
                                <option value="Abierta">Abierta</option>
                            </select>
                        </div>

                    </div>
                </div>

            )}
            <div className="flex items-center justify-between mb-3 mt-3">
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

export default CashRegisterFilters;
