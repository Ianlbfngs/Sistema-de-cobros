import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import { verifyBackendStatus } from '/src/shared/utils/backendStatus';
import { useTemporaryAlert } from '../../shared/utils/useTemporaryAlert';
import { Link, useParams, useNavigate } from 'react-router-dom';


function EditStore() {
  const navigate = useNavigate();
  const { idStore } = useParams();

  const [apiOnline, setApiOnline] = useState(true);

  const [store, setStore] = useState({
    name: "",
    address: ""
  });


  const { id, name, address } = store;

  const { visibleSuccessAlert, showSuccessAlert } = useTemporaryAlert("/admin/locales");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const run = async () => {
      const backendOK = await verifyBackendStatus(setApiOnline);
      if (backendOK) {
        try {
          const resultStore = await axios.get(`http://localhost:8080/api/stores/${idStore}`, { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
          setStore(resultStore.data);
        } catch (error) {
          console.error("Error fetching the store with id '" + idStore + "' :", error);
          if (error.status === 404) {
            alert("El local con id '" + idStore + "' no existe en el sistema");
          }
          alert("Error intentando obtener el local con id '" + idStore + "'");
          alert("Codigo de error: " + error.code);
          navigate("/admin/locales");
        }
      }
    };

    run();
  }, []);

  const onInputChangeStore = (e) => {
    const { name, value } = e.target;

    setStore(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (! await verifyBackendStatus(setApiOnline)) return;
    try {
      await axios.put(`http://localhost:8080/api/admin/stores/update/${idStore}`, store, { headers: { Authorization: 'Bearer ' + localStorage.getItem('jwtToken') } });
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

  return (
    <div className='container'>
      <div className="mt-2 mb-4">
        <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-2">
          Editar informacion del local
        </h3>
      </div>
      {visibleSuccessAlert && (
        <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 " role="alert">
          <div className="absolute top-0 left-0 h-1 bg-green-700 w-full progress-bar"></div>
          <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div>
            <span className="font-medium">Información del local actualizada correctamente</span>
          </div>
        </div>
      )}
      {(errorMessage !== "") && (
        <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 " role="alert">
          <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div>
            <span className="font-medium">No fue posible actualizar la información del local: {errorMessage}</span>
          </div>
        </div>
      )}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={(e) => onSubmit(e)} >
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="id" className="block text-sm/6 font-medium text-gray-900">Id</label>
            </div>
            <div className="mt-2">
              <input type="text" name="id" id="id" value={idStore} disabled className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 cursor-not-allowed" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">Nombre</label>
            </div>
            <div className="mt-2">
              <input type="text" name="name" id="name" value={name} maxLength={100} onChange={onInputChangeStore} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900">Dirección</label>
            </div>
            <div className="mt-2">
              <input type="text" name="address" id="address" value={address} maxLength={100} onChange={onInputChangeStore} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type='submit' className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-cyan-600 group-hover:from-green-400 group-hover:to-cyan-600 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
              <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                Actualizar local
              </span>
            </button>
            <Link to={'/admin/locales'} className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-yellow-500 to-orange-500 group-hover:from-yellow-500 group-hover:to-orange-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
              <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                Volver
              </span>
            </Link>
          </div>
        </form>
      </div>
      {!apiOnline && (
        <div className="error-message-1" role='alert'>
          <span>Error: No fue posible establecer conexion con el sistema de cobros</span>
        </div>
      )}
    </div >
  )
}

export default EditStore
