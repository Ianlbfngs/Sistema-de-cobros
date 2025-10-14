import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CashRegisterFilters from '/src/public_components/filters/CashRegisterFilters.jsx';
import { verifyBackendStatus } from '/src/shared/utils/backendStatus';
import { Link } from 'react-router-dom';

function CashRegisters() {
    const [apiOnline, setApiOnline] = useState(true);

    const [cashRegisters, setCashRegisters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorLoadingCashRegisters, setErrorLoadingCashRegisters] = useState(false);


    useEffect(() => {
        const run = async () => {
            const backendOK = await verifyBackendStatus(setApiOnline);
            if (backendOK) {
                try {
                    setLoading(true);
                    const resultCashRegisters = await axios.get("http://localhost:8080/api/cashRegisters/all", { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
                    setCashRegisters(resultCashRegisters.data);
                    setErrorLoadingCashRegisters(false);
                } catch (error) {
                    console.error("Error fetching cash registers:", error);
                    setErrorLoadingCashRegisters(true);
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
        storeName: "",
        openDate: "",
        openUser: "",
        closeDate: "",
        closeUser: "",
        status: "",
        audit: ""

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
    const filteredCashRegisters = Array.isArray(cashRegisters)
        ? cashRegisters.filter(cr => {
            const conditions = [
                !filters.id || cr.id === Number(filters.id),
                !filters.storeName || cr.store.name.toLowerCase().includes(filters.storeName.toLowerCase()),
                !filters.openDate || formatDateFromDDMMYYYY(cr.openDateTime) === filters.openDate,
                !filters.openUser || cr.openingUserName.toLowerCase().includes(filters.openUser.toLowerCase()),
                !filters.closeDate || formatDateFromDDMMYYYY(cr.closeDate) === filters.closeDate,
                !filters.closeUser || cr.closingUserName?.toLowerCase().includes(filters.closeUser.toLowerCase()),
                !filters.audit || cr.auditStatus?.toLowerCase() === filters.audit.toLowerCase(),
                !filters.status || (filters.status === "Abierta" ? !cr.closeDateTime : !!cr.closeDateTime),

            ];
            return conditions.every(Boolean);
        })
        : [];


    //paginado
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCashRegisters = filteredCashRegisters.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil((filteredCashRegisters?.length || 0) / itemsPerPage);

    function renderCashRegisters() {
        if (loading) {
            return (
                <tr className="table-body-row">
                    <td colSpan={14} className="text-center p-3 ">
                        Cargando datos...
                    </td>
                </tr>
            );
        }
        try {
            if (currentCashRegisters.length === 0) {
                return (
                    <tr className="table-body-row">
                        <td colSpan={14} className="text-center p-3 text-red-400">
                            No se encotraron cajas en la base de datos
                        </td>
                    </tr>
                );
            }
            return currentCashRegisters.map((cashRegister, index) => (
                <tr key={index} className="table-body-row">

                    <td className="table-cell">{cashRegister.id}</td>
                    <td className="table-cell">{cashRegister.store.name}</td>
                    <td className="table-cell text-yellow-300">{cashRegister.openDateTime}</td>
                    <td className="table-cell text-yellow-300">{cashRegister.openingUserName}</td>
                    <td className="table-cell text-yellow-300">{cashRegister.openAmount?.toLocaleString("es-AR") + " $"}</td>
                    <td className="table-cell text-red-300">{cashRegister.totalWithdrawnAmount?.toLocaleString("es-AR") + " $"}</td>
                    <td className="table-cell text-green-300">{cashRegister.totalReceivedAmount?.toLocaleString("es-AR") + " $"}</td>
                    <td className="table-cell text-purple-300">{cashRegister.closeAmount != null ? cashRegister.closeAmount.toLocaleString("es-AR") + " $" : "N/A"}</td>
                    <td className="table-cell text-purple-300">{cashRegister.closeDateTime || "N/A"}</td>
                    <td className="table-cell text-purple-300">{cashRegister.closingUserName || "N/A"}</td>
                    <td className='table-cell'>
                        {cashRegister.auditStatus !== null ?
                            (cashRegister.auditStatus === "CONSISTENT" ?
                                <Link to={`auditar/${cashRegister.id}`} ><span className='text-cyan-400'>Consistente</span></Link>
                                :
                                <Link to={`auditar/${cashRegister.id}`} className='underline'><span className='text-orange-400'>Inconsistente</span></Link>
                            )
                            :
                            <span>-</span>
                        }
                    </td>
                    {cashRegister.closeDateTime ?
                        (<>
                            <td className='table-cell text-red-400'>Cerrada</td>
                            <td className='table-cell'></td>
                        </>)
                        :
                        (<>
                            <td className='table-cell text-green-400'>Abierta</td>
                            <td className='table-cell'>
                                <Link to={`cerrar/${cashRegister.id}`} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-600 to-yellow-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                    <span className="relative px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                        Cerrar caja
                                    </span>
                                </Link>

                            </td>
                        </>)
                    }
                    <td className="py-3 ">
                        <div>
                            <Link to={`${cashRegister.id}/movimientos`} className="table-cell-link group bg-gradient-to-br from-blue-900 to-cyan-400  hover:text-white dark:text-white focus:ring-4 focus:outline-none ">
                                <span className="table-cell-link-span">
                                    Ver Movimientos
                                </span>
                            </Link>
                        </div>
                    </td>



                </tr>
            ))
        } catch (error) {
            console.error("Error loading cash registers:", error);
            return (
                <tr className="table-body-row">
                    <td colSpan={14} className="text-center p-3 text-red-400">
                        Error cargando las cajas
                    </td>
                </tr>
            )
        }
    }

    return (
        <div className="relative overflow-x-auto">
            <div className="mt-2 mb-4">
                <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-2">
                    Listado de cajas
                </h3>
            </div>
            <div>
                <CashRegisterFilters filters={filters} handleFilterChange={handleFilterChange} setFilters={setFilters} />
            </div>
            {/* Tabla */}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center">
                    <tr>
                        <th scope='col' className="table-cell">ID</th>
                        <th scope='col' className="table-cell">Local</th>
                        <th scope='col' className="table-cell">Hora de <span className='text-yellow-300'>apertura</span></th>
                        <th scope='col' className="table-cell">Usuario <span className='text-yellow-300'>apertura</span></th>
                        <th scope='col' className="table-cell">Monto de <span className='text-yellow-300'>apertura</span></th>
                        <th scope='col' className="table-cell">Total retirado</th>
                        <th scope='col' className="table-cell">Total ingresado</th>
                        <th scope='col' className="table-cell">Monto de <span className='text-purple-300'>cierre</span></th>
                        <th scope='col' className="table-cell">Hora de <span className='text-purple-300'>cierre</span></th>
                        <th scope='col' className="table-cell">Usuario <span className='text-purple-300'>cierre</span></th>
                        <th scope='col' className='table-cell'>Auditoria</th>
                        <th scope='col' className='table-cell'>Estado</th>
                        <th scope='col' className='table-cell'></th>
                        <th scope='col' className="table-cell">Movimientos</th>

                    </tr>
                </thead>
                <tbody>
                    {errorLoadingCashRegisters ? (
                        <tr className="table-body-row">
                            <td colSpan={14} className="text-center p-3 text-red-400">
                                Error cargando las cajas
                            </td>
                        </tr>
                    ) : renderCashRegisters()}
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
                                    className={`px-3 py-2 leading-tight border border-gray-300 dark:border-gray-600 
                        ${currentPage === i + 1
                                            ? "bg-blue-500 text-white dark:bg-blue-600"
                                            : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"}`}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            {/* mensaje api offline */}
            {!apiOnline && (
                <div className="error-message-1" role='alert'>
                    <span>Error: No fue posible establecer conexion con el sistema de cobros</span>
                </div>
            )}
        </div>
    )
}

export default CashRegisters
