import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { verifyBackendStatus } from '/src/shared/utils/backendStatus';
import { useTemporaryAlert } from '../../shared/utils/useTemporaryAlert';
import { Link } from 'react-router-dom';


function DeleteSupplier() {
  const [apiOnline, setApiOnline] = useState(true);

  const [supplier, setSupplier] = useState({});
  const [id, setId] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [foundSupplier, setFoundSupplier] = useState(true);

  const { visibleSuccessAlert, showSuccessAlert } = useTemporaryAlert("/admin/proveedores");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const run = async () => {
      await verifyBackendStatus(setApiOnline);
    };
    const obtainSupplierToDelete = async () => {
      try {
        const resultSupplier = await axios.get('http://localhost:8080/api/suppliers/' + id, {
          headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") }
        });
        setSupplier(resultSupplier.data);
        setFoundSupplier(true);
      } catch (error) {
        console.error("Error fetching the supplier with id " + id + " :", error);
        if (error?.status === 404 || error?.code === "ERR_BAD_REQUEST") {
          setFoundSupplier(false);
        }
      }
    };

    if (id) {
      obtainSupplierToDelete();
    }
    run();
  }, [id]);

  const onInputChangeId = (e) => {
    const { value } = e.target;
    setId(value);
  };

  const confirmDeleteAction = () => {
    if (foundSupplier) {
      setConfirmDelete(!confirmDelete);
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (! await verifyBackendStatus(setApiOnline)) return;
    if (confirmDelete == false) return;
    try {
      await axios.put('http://localhost:8080/api/admin/suppliers/delete/' + id, null, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") }
      });
      showSuccessAlert();


    } catch (error) {
      console.error(error);
      setErrorMessage(
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.error || error.message || "Error desconocido"
      );
    }
  }

  function renderSupplier() {
    try {
      return (
        <table className="w-full text-sm text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Razón Social</th>
              <th scope="col" className="px-6 py-3">CUIT</th>
              <th scope="col" className="px-6 py-3">Teléfono</th>
              <th scope="col" className="px-6 py-3">Correo</th>
              <th scope="col" className="px-6 py-3">Dirección</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-center">
              <th scope='row' className="px-6 py-3">{supplier.id}</th>
              <td scope="row" className="px-6 py-3">{supplier.companyName}</td>
              <td scope="row" className="px-6 py-3">{supplier.cuit}</td>
              <td scope="row" className="px-6 py-3">{supplier.phoneNumber}</td>
              <td scope="row" className="px-6 py-3">{supplier.email || "N/A"}</td>
              <td scope="row" className="px-6 py-3">{supplier.address || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      )
    } catch (error) {
      console.error("Error loading the suppliers to delete:", error);
      return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
          <td colSpan={6} className='text-center p-3 text-red-400'  >Error cargando el proveedor</td>
        </tr>
      )
    }
  }

  return (
    <div className='container'>
      <div className="mt-2 mb-4">
        <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-2">
          Eliminar proveedor
        </h3>
      </div>
      {visibleSuccessAlert && (
        <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 " role="alert">
          <div className="absolute top-0 left-0 h-1 bg-green-700 w-full progress-bar"></div>
          <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div>
            <span className="font-medium">Proveedor eliminado exitosamente</span>
          </div>
        </div>
      )}
      {(errorMessage !== "") && (
        <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 " role="alert">
          <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div>
            <span className="font-medium">No fue posible eliminar el proveedor solicitado: {errorMessage}</span>
          </div>
        </div>
      )}
      <div className="relative overflow-x-auto">
        {confirmDelete
          ?
          (
            <form className="space-y-6" onSubmit={(e) => onSubmit(e)} >
              <div className="w-full flex justify-center">
                <div className="w-full max-w-md">
                  <div className="flex items-center justify-between">
                    <label htmlFor="idToDelete" className="block text-sm/6 font-medium text-gray-900">Id del proveedor a eliminar</label>
                  </div>
                  <div className="mt-2">
                    <input type="text" name="idToDelete" id="idToDelete" value={id} onChange={onInputChangeId} required disabled className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 cursor-not-allowed" />
                  </div>
                </div>
              </div>
              {renderSupplier()}

              <div className="flex gap-2">
                <button type='submit' className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-600 to-amber-600 group-hover:from-green-400 group-hover:to-cyan-600 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                  <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                    Confirmar eliminación
                  </span>
                </button>
                <button type='button' onClick={confirmDeleteAction} className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-yellow-500 to-orange-500 group-hover:from-yellow-500 group-hover:to-orange-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                  <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                    Cancelar
                  </span>
                </button>
              </div>
            </form>

          )
          :
          (
            <div className="space-y-6">
              <div className="w-full flex justify-center">
                <div className="w-full max-w-md">
                  <div className="flex items-center justify-between">
                    <label htmlFor="idToDelete" className="block text-sm/6 font-medium text-gray-900">Id del proveedor a eliminar</label>
                  </div>
                  {!foundSupplier &&
                    (
                      <span className='text-red-500'>* No se encontro ningun proveedor con el ID solicitado</span>
                    )
                  }
                  <div className="mt-2">
                    <input type="text" name="idToDelete" id="idToDelete" value={id} onChange={onInputChangeId} required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button type='button' onClick={confirmDeleteAction} className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-600 to-amber-600 group-hover:from-green-400 group-hover:to-cyan-600 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                  <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                    Eliminar proveedor
                  </span>
                </button>
                <Link to={'/admin/proveedores'} className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-yellow-500 to-orange-500 group-hover:from-yellow-500 group-hover:to-orange-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                  <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                    Volver
                  </span>
                </Link>
              </div>
            </div>
          )

        }
      </div>
      {!apiOnline && (
        <div className="error-message-1" role='alert'>
          <span>Error: No fue posible establecer conexion con el sistema de cobros</span>
        </div>
      )}
    </div >
  )
}

export default DeleteSupplier
