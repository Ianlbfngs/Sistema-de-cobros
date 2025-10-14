import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { verifyBackendStatus } from '/src/shared/utils/backendStatus';
import { Link, useParams } from 'react-router-dom';

function CashMovements() {
  const [apiOnline, setApiOnline] = useState(true);

  const { cashRegisterID } = useParams();

  const [cashMovements, setCashMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorLoadingCashMovements, setErrorLoadingCashMovements] = useState(false);


  useEffect(() => {
    const run = async () => {
      const backendOK = await verifyBackendStatus(setApiOnline);
      if (backendOK) {
        try {
          setLoading(true);
          const resultCashRegisters = await axios.get(`http://localhost:8080/api/cashMovements/all/${cashRegisterID}`, { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
          setCashMovements(resultCashRegisters.data);
          setErrorLoadingCashMovements(false);
        } catch (error) {
          console.error("Error fetching cash registers movements:", error);
          setErrorLoadingCashMovements(true);
        }
      }
      setLoading(false);

    };

    run();
  }, []);

  //filtro
  const [filters, setFilters] = useState({
    id: "",
    movementType: "",
    amount: "",
    concept: "",
    date: "",
  });

  //paginado
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCashMovements = cashMovements.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil((cashMovements?.length || 0) / itemsPerPage);

  function renderCashMovements() {
    if (loading) {
      return (
        <tr className="table-body-row">
          <td colSpan={6} className="text-center p-3 ">
            Cargando datos...
          </td>
        </tr>
      );
    }
    try {
      if (currentCashMovements.length === 0) {
        return (
          <tr className="table-body-row">
            <td colSpan={6} className="text-center p-3 text-red-400">
              No se encotraron movimientos de la caja con id "{cashRegisterID}" en la base de datos
            </td>
          </tr>
        );
      }
      return currentCashMovements.map((cashMovement, index) => (
        <tr key={index} className="table-body-row">

          <td className="table-cell">{cashMovement.id}</td>
          <td className="table-cell">{cashMovement.saleId ? (<Link to={`/admin/ventas/detalle/${cashMovement.saleId}`} className='underline'>{cashMovement.saleId}</Link>): "N/A"}</td>
          <td className="table-cell"><span className={cashMovement.movementType === "INGRESO" ? "text-green-400" : "text-red-400"}>{cashMovement.movementType}</span></td>
          <td className="table-cell">{cashMovement.amount?.toLocaleString("es-AR") + " $"}</td>
          <td className="table-cell">{cashMovement.concept}</td>
          <td className="table-cell">{cashMovement.date}</td>

        </tr>
      ))
    } catch (error) {
      console.error("Error loading cash registers:", error);
      return (
        <tr className="table-body-row">
          <td colSpan={6} className="text-center p-3 text-red-400">
            Error cargando los movimientos de la caja con id  "{cashRegisterID}"
          </td>
        </tr>
      )
    }
  }

  return (
    <div className="relative overflow-x-auto">
      <div className="mt-2 mb-4">
        <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-2">
          Movimientos de la caja con id "{cashRegisterID}"
        </h3>
      </div>
      {/* Tabla */}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center">
          <tr>
            <th scope='col' className="table-cell">ID</th>
            <th scope='col' className="table-cell">ID de venta </th>
            <th scope='col' className="table-cell">Tipo de movimiento</th>
            <th scope='col' className="table-cell">Monto</th>
            <th scope='col' className="table-cell">Concepto</th>
            <th scope='col' className="table-cell">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {errorLoadingCashMovements ? (
            <tr className="table-body-row">
              <td colSpan={6} className="text-center p-3 text-red-400">
                Error cargando los movimientos
              </td>
            </tr>
          ) : renderCashMovements()}
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
      {/* Botone de volver*/}
      <div className="flex m-10">
        <Link to={'/admin/cajas'} className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-yellow-500 to-orange-500 group-hover:from-yellow-500 group-hover:to-orange-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
          <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
            Volver
          </span>
        </Link>
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

export default CashMovements
