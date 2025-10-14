import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { verifyBackendStatus } from '/src/shared/utils/backendStatus';
import { useTemporaryAlert } from '../../shared/utils/useTemporaryAlert';
import { Link, useNavigate, useParams } from 'react-router-dom';


function AuditCashRegister() {
  const [apiOnline, setApiOnline] = useState(true);

  const navigate = useNavigate();

  const { cashRegisterID } = useParams();

  const [cashRegister, setCashRegister] = useState({
    id: 0,
    store: {
      id: 0,
      name: ""
    },
    closeAmount: "",
    openAmount: "",
    totalWithdrawnAmount: "",
    totalReceivedAmount: "",

  });

  const { id, store, closeAmount, openAmount, totalWithdrawnAmount, totalReceivedAmount } = cashRegister;

  const [calculatedCloseAmount, setCalculatedCloseAmount] = useState(0);
  const [calculatedAmountDifference, setCalculatedAmountDifference] = useState(0);


  const [errorLoadingCashRegister, setErrorLoadingCashRegister] = useState(false);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const run = async () => {
      const backendOK = await verifyBackendStatus(setApiOnline);
      if (backendOK) {
        try {
          setLoading(true);

          const resultCashRegister = await axios.get(`http://localhost:8080/api/cashRegisters/${cashRegisterID}`, { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
          if (resultCashRegister.data.closeDateTime === null) {
            alert("Caja no auditable");
            navigate("/admin/cajas");
          }
          setCashRegister(resultCashRegister.data);
          setErrorLoadingCashRegister(false);
          //calculo del monto de cierre real y la diferencia (si es q hay) con el monto de cierre declarado
          setCalculatedCloseAmount(resultCashRegister.data.openAmount + resultCashRegister.data.totalReceivedAmount + resultCashRegister.data.totalWithdrawnAmount);
          setCalculatedAmountDifference(calculatedCloseAmount - resultCashRegister.data.closeAmount);
        } catch (error) {
          console.error("Error fetching the cash register data :", error);
          setErrorLoadingCashRegister(true);
        } finally {
          setLoading(false);
        }

      } else {
        setLoading(false);
      }
    };

    run();
  }, [calculatedCloseAmount]);

  function renderCashRegister() {
    if (loading) {
      return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-center">
          <td colSpan={6} className="text-center p-3 ">
            Cargando datos...
          </td>
        </tr>
      );
    }
    try {
      if (cashRegister.length === 0) {
        return (
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-center">
            <td colSpan={6} className="text-center p-3 text-red-400">
              No se encontro la caja solicitada en la base de datos
            </td>
          </tr>
        );
      }
      return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-center">

          <td scope='row' className="table-cell">{id}</td>
          <td scope='row' className="table-cell">{store.name}</td>
          <td scope='row' className="table-cell text-yellow-300">{openAmount?.toLocaleString("es-AR") + " $"}</td>
          <td scope='row' className="table-cell text-green-300">{totalReceivedAmount?.toLocaleString("es-AR") + " $"}</td>
          <td scope='row' className="table-cell text-red-300">{totalWithdrawnAmount?.toLocaleString("es-AR") + " $"}</td>
          <td scope='row' className="table-cell text-purple-300">{closeAmount?.toLocaleString("es-AR") + " $"}</td>

        </tr>
      )
    } catch (error) {
      console.error("Error loading cash register:", error);
      return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-center">
          <td colSpan={6} className="text-center p-3 text-red-400">
            Error cargando la caja solicitada
          </td>
        </tr>
      )
    }
  }

  return (
    <div className='container'>
      <div className="mt-2 mb-4">
        <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-2">
          Detalle de auditoria de caja - ID {cashRegister.id}
        </h3>
      </div>
      <div className="mt-10 ">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center">
            <tr>
              <th scope='row' className="table-cell">ID</th>
              <th scope='row' className="table-cell">Local</th>
              <th scope='row' className="table-cell">Monto de <span className='text-yellow-300'>apertura</span></th>
              <th scope='row' className="table-cell">Total ingresado</th>
              <th scope='row' className="table-cell">Total retirado</th>
              <th scope='row' className='table-cell'>Monto de <span className='text-purple-300'>cierre</span></th>

            </tr>
          </thead>
          <tbody>
            {errorLoadingCashRegister ?
              (<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-center">
                <td colSpan={6} className="text-center p-3 text-red-400">
                  Error cargando la caja solicitada
                </td>
              </tr>)
              : renderCashRegister()}
          </tbody>
        </table>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full max-w-2xl">
        <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4 border">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Auditoría de Caja</h3>

          <div className="grid grid-cols-2 gap-4 text-lg">
            <div className="bg-purple-50 p-3 rounded-lg border">
              <p>
                <span className="font-semibold text-purple-600">Monto calculado:</span>
              </p>
              <p className="text-gray-700">{calculatedCloseAmount.toLocaleString("es-AR")} $</p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border">
              <p>
                <span className="font-semibold text-blue-600">Monto declarado:</span>
              </p>
              <p className="text-gray-700">{closeAmount.toLocaleString("es-AR")} $</p>
            </div>
          </div>

          {(closeAmount > calculatedCloseAmount) && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md">
              <p className="text-yellow-700 font-medium">
                ⚠️ El monto <span className="text-blue-600">declarado</span> es mayor al <span className="text-purple-600">calculado</span>.
              </p>
            </div>
          )}

          {(closeAmount < calculatedCloseAmount) && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md">
              <p className="text-red-700 font-medium">
                ❌ El monto declarado es menor al monto calculado (faltante en caja).
              </p>
            </div>
          )}

          {closeAmount === calculatedCloseAmount && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-md">
              <p className="text-green-700 font-medium">✅ Caja cerrada correctamente, no hay diferencia.</p>
            </div>
          )}

          <div className="mt-4 bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-gray-700 text-lg">
              Diferencia: <span className="font-bold">{Math.abs(calculatedAmountDifference).toLocaleString("es-AR")} $</span>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

        <div className="flex justify-center">
          <Link
            to={'/admin/cajas'}
            className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-yellow-500 to-orange-500 group-hover:from-yellow-500 group-hover:to-orange-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
          >
            <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
              Volver
            </span>
          </Link>
        </div>
      </div>
      {/* mensaje api offline */}
      {!apiOnline && (
        <div className="error-message-1" role='alert'>
          <span>Error: No fue posible establecer conexion con el sistema de cobros</span>
        </div>
      )}
    </div >
  )
}

export default AuditCashRegister
