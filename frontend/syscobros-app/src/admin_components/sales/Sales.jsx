import axios from 'axios';
import React, { useEffect, useState } from 'react'
import SalesFilters from '/src/public_components/filters/SalesFilters.jsx'
import { verifyBackendStatus } from '/src/shared/utils/backendStatus';
import { Link } from 'react-router-dom';

function Sales() {
    const [apiOnline, setApiOnline] = useState(true);

    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorLoadingSales, setErrorLoadingSales] = useState(false);


    useEffect(() => {
        const run = async () => {
            const backendOK = await verifyBackendStatus(setApiOnline);
            if (backendOK) {
                try {
                    setLoading(true);

                    const resultSales = await axios.get("http://localhost:8080/api/sales/all", { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
                    setSales(resultSales.data);
                    setErrorLoadingSales(false);
                } catch (error) {
                    console.error("Error fetching sales:", error);
                    setErrorLoadingSales(true);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        run();
    }, []);

    //filtro
    const [filters, setFilters] = useState({
        id: "",
        userId: "",
        storeName: "",
        email: "",
        method: "",
        dateTime: "",
        total: "",
        status: ""
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    //formateador fecha
    function formatDateFromDDMMYYYY(dateString) {
        if (!dateString) return null;
        const [datePart] = dateString.split(" ");
        const [day, month, year] = datePart.split("/").map(Number);
        if (!day || !month || !year) return null;
        return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
    //condiciones filtro
    const filteredSales = Array.isArray(sales)
        ? sales.filter(sale => {
            const conditions = [
                !filters.id || sale.id === Number(filters.id),
                !filters.userId || sale.userId === Number(filters.userId),
                !filters.storeName || sale.storeName.toLowerCase().includes(filters.storeName.toLowerCase()),
                !filters.email || sale.client?.email.toLowerCase().includes(filters.email.toLowerCase()),
                !filters.method || sale.paymentMethod.method === filters.method,
                !filters.total || sale.total === Number(filters.total),
                !filters.dateTime || formatDateFromDDMMYYYY(sale.dateTime) === filters.dateTime,
                !filters.status || sale.status === filters.status
            ];
            return conditions.every(Boolean);
        })
        : [];


    //paginado
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSales = filteredSales.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil((filteredSales?.length || 0) / itemsPerPage);

    function renderSales() {
        if (loading) {
            return (
                <tr className="table-body-row">
                    <td colSpan={9} className="text-center p-3 ">
                        Cargando datos...
                    </td>
                </tr>
            );
        }
        try {
            if (currentSales.length === 0) {
                return (
                    <tr className="table-body-row">
                        <td colSpan={9} className="text-center p-3 text-red-400">
                            No se encotraron ventas en la base de datos
                        </td>
                    </tr>
                );
            }
            return currentSales.map((sale, index) => (
                <tr key={index} className="table-body-row">
                    <td className="table-cell">{sale.id}</td>
                    <td className="table-cell">{sale.referenceName + " | ID:" + sale.userId}</td>
                    <td className="table-cell">{sale.storeName}</td>
                    <td className="table-cell">{sale.client?.email || "N/A"}</td>
                    <td className="table-cell">{sale.paymentMethod.method}</td>
                    <td className="table-cell">{sale.dateTime}</td>
                    <td className="table-cell">{sale.total?.toLocaleString("es-AR") + " $"}</td>
                    <td className="table-cell">{sale.status}</td>
                    <td className="table-cell"><Link to={`detalle/${sale.id}`} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-600 to-cyan-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                        <span className="relative px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                            Ver detalle
                        </span>
                    </Link></td>
                </tr>
            ));
        } catch (error) {
            console.error("Error loading sales:", error);
            return (
                <tr className="table-body-row">
                    <td colSpan={9} className="text-center p-3 text-red-400">
                        Error cargando las ventas
                    </td>
                </tr>
            )
        }
    }

    return (
        <div className="relative overflow-x-auto">
            <div className="mt-2 mb-2">
                <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-2">
                    Listado de ventas
                </h3>
            </div>
            <div>
                <SalesFilters filters={filters} handleFilterChange={handleFilterChange} setFilters={setFilters} />

            </div>
            <table className="table">
                <thead className="table-head">
                    <tr>
                        <th scope='col' className="table-cell">ID Venta</th>
                        <th scope='col' className="table-cell">Cajero</th>
                        <th scope='col' className="table-cell">Local</th>
                        <th scope='col' className="table-cell">Cliente</th>
                        <th scope='col' className='table-cell'>Metodo de pago</th>
                        <th scope='col' className='table-cell'>Fecha</th>
                        <th scope='col' className='table-cell'>Total</th>
                        <th scope='col' className='table-cell'>Estatus</th>
                        <th scope='col' className='table-cell'>Detalle</th>
                    </tr>
                </thead>
                <tbody>
                    {errorLoadingSales ?
                        (<tr className="table-body-row">
                            <td colSpan={9} className="text-center p-3 text-red-400">
                                Error cargando las ventas
                            </td>
                        </tr>)
                        : renderSales()}
                </tbody>
            </table>

            {/* Footer  */}
            <div className="w-full flex justify-center border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <nav className="flex justify-center p-3">
                    <ul className="inline-flex -space-x-px text-sm">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i + 1}>
                                <button
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`table-footer-page-button ${currentPage === i + 1
                                        ? "table-footer-page-button-selected"
                                        : "table-footer-page-button-unselected"}`}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            {!apiOnline && (
                <div className="error-message-1" role='alert'>
                    <span>Error: No fue posible establecer conexion con el sistema de cobros</span>
                </div>
            )}
        </div>
    )
}

export default Sales
