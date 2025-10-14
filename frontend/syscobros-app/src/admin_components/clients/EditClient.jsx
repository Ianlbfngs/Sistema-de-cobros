import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import { verifyBackendStatus } from '/src/shared/utils/backendStatus';
import { useTemporaryAlert } from '../../shared/utils/useTemporaryAlert';
import { Link, useParams, useNavigate } from 'react-router-dom';


function EditClient() {
  const navigate = useNavigate();
  const { idClient } = useParams();

  const [apiOnline, setApiOnline] = useState(true);

  const [client, setClient] = useState({
    name: "",
    surname: "",
    phoneNumber: "",
    email: "",
    address: ""
  });


  const { name, surname, phoneNumber, email, address } = client;

  const { visibleSuccessAlert, showSuccessAlert } = useTemporaryAlert("/admin/clientes");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const run = async () => {
      const backendOK = await verifyBackendStatus(setApiOnline);
      if (backendOK) {
        try {
          const resultClient = await axios.get(`http://localhost:8080/api/admin/clients/${idClient}`, { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
          setClient(resultClient.data);
        } catch (error) {
          console.error("Error fetching the client with id '" + idClient + "' :", error);
          if (error.status === 404) {
            alert("El cliente con id '" + idClient + "' no existe en el sistema");
          }
          alert("Error intentando obtener el cliente con id '" + idClient + "'");
          alert("Codigo de error: " + error.code);
          navigate("/admin/clients");
        }
      }
    };

    run();
  }, []);

  const onInputChangeClient = (e) => {
    const { name, value } = e.target;

    setClient(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (! await verifyBackendStatus(setApiOnline)) return;
    try {
      await axios.put(`http://localhost:8080/api/admin/clients/update/${idClient}`, client, { headers: { Authorization: 'Bearer ' + localStorage.getItem('jwtToken') } });
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
          Editar cliente
        </h3>
      </div>
      {visibleSuccessAlert && (
        <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 " role="alert">
          <div className="absolute top-0 left-0 h-1 bg-green-700 w-full progress-bar"></div>
          <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div>
            <span className="font-medium">Información del cliente actualizada correctamente</span>
          </div>
        </div>
      )}
      {(errorMessage !== "") && (
        <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 " role="alert">
          <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div>
            <span className="font-medium">No fue posible actualizar la información del cliente: {errorMessage}</span>
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
              <input type="text" name="id" id="id" value={idClient} disabled className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 cursor-not-allowed" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">Nombre</label>
            </div>
            <div className="mt-2">
              <input type="text" name="name" id="name" value={name} maxLength={100} onChange={onInputChangeClient} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="surname" className="block text-sm/6 font-medium text-gray-900">Apellido</label>
            </div>
            <div className="mt-2">
              <input type="text" name="surname" id="surname" value={surname} maxLength={100} onChange={onInputChangeClient} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="phoneNumber" className="block text-sm/6 font-medium text-gray-900">Telefono</label>
            </div>
            <div className="mt-2">
              <input type="text" name="phoneNumber" id="phoneNumber" value={phoneNumber} maxLength={100} onChange={onInputChangeClient} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Correo</label>
            </div>
            <div className="mt-2">
              <input type="email" name="email" id="email" value={email} maxLength={100} onChange={onInputChangeClient} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900">Dirección</label>
            </div>
            <div className="mt-2">
              <input type="text" name="address" id="address" value={address} maxLength={100} onChange={onInputChangeClient} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type='submit' className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-cyan-600 group-hover:from-green-400 group-hover:to-cyan-600 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
              <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                Actualizar cliente
              </span>
            </button>
            <Link to={'/admin/clientes'} className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-yellow-500 to-orange-500 group-hover:from-yellow-500 group-hover:to-orange-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
              <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                Volver
              </span>
            </Link>
          </div>
        </form>
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

export default EditClient
