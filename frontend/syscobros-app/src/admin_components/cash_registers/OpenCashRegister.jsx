import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { verifyBackendStatus } from '/src/shared/utils/backendStatus';
import { useTemporaryAlert } from '../../shared/utils/useTemporaryAlert';
import { Link } from 'react-router-dom';


function OpenCashRegister() {
    const [apiOnline, setApiOnline] = useState(true);

    const [openAmount, setOpenAmount] = useState({
        "openAmount": 0
    });

    const [storeID, setStoreID] = useState(0);

    const [storesDDL, setStoresDDL] = useState([]);

    const [cashRegisterIsOpen, setCashRegisterIsOpen] = useState(false); //flag por si ya hay una caja abierta en x local. Linea 36.
    const { visibleSuccessAlert, showSuccessAlert } = useTemporaryAlert("/admin/cajas");
    const [errorMessage, setErrorMessage] = useState("");


    useEffect(() => {
        const run = async () => {
            const backendOK = await verifyBackendStatus(setApiOnline);
            if (backendOK) {

                try {
                    const resultStores = await axios.get('http://localhost:8080/api/stores/all', { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
                    setStoresDDL(resultStores.data);
                } catch (error) {
                    console.error("Error fetching the stores data :", error);
                }
            }
        };

        run();
    }, []);

    useEffect(() => {
        const obtainCashRegisterStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/cashRegisters/open/${storeID}`, { //pregunta si el local x tiene una caja abierta
                    headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") }
                });
                if (response.status === 204) {
                    setCashRegisterIsOpen(false); //si esta cerrada devuelve 204 - No Content

                } else {
                    setCashRegisterIsOpen(true); //si no da error, hay una caja abierta
                }
            } catch (error) {
                console.error(`Error fetching the store with id ${storeID}:`, error); //si devuelve un error se imprime en consola

            }
        };

        if (storeID) {
            obtainCashRegisterStatus();
        }
    }, [storeID]);

    const onInputChangeStoreID = (e) => {
        const { name, value } = e.target;
        setStoreID(value);
    }

    const onInputChangeOpenAmount = (e) => {
        const { name, value } = e.target;
        setOpenAmount(prev => ({
            ...prev,
            [name]: parseFloat(value)
        }));

    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        if (storeID === 0) { //si no se selecciono un local
            alert("Seleccione un local"); //se avisa
            return; //y no pasa nada
        }
        if (! await verifyBackendStatus(setApiOnline) || cashRegisterIsOpen) return; //cancela el submit si no se puede establecer conexion con el sistema o si la caja ya abierta
        try {
            await axios.post(`http://localhost:8080/api/cashRegisters/open/${storeID}`, openAmount, { headers: { Authorization: 'Bearer ' + localStorage.getItem('jwtToken') } }); //abre la caja
            showSuccessAlert();
        } catch (error) {
            alert("Hubo un error al intentar abrir la caja");
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
                    Abrir caja
                </h3>
            </div>
            {visibleSuccessAlert && (
                <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 " role="alert">
                    <div className="absolute top-0 left-0 h-1 bg-green-700 w-full progress-bar"></div>
                    <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <div>
                        <span className="font-medium">Caja abierta exitosamente</span>
                    </div>
                </div>
            )}
            {(errorMessage !== "") && (
                <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 " role="alert">
                    <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <div>
                        <span className="font-medium">No fue posible abrir la caja: {errorMessage}</span>
                    </div>
                </div>
            )}
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={(e) => onSubmit(e)} >
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="storesDDL" className="block text-sm/6 font-medium text-gray-900">Local</label>
                            {cashRegisterIsOpen &&
                                <span className='text-red-500'>* Ya hay una caja abierta en este local</span>

                            }
                        </div>
                        <div className="mt-2">
                            <select name="storesDDL" id="storesDDL" value={storeID} onChange={onInputChangeStoreID} className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'>
                                <option value={0}>N/A</option>
                                {
                                    Array.isArray(storesDDL)
                                        ?
                                        storesDDL.map((store, index) => (
                                            <option key={index} value={store.id}>{store.name}</option>
                                        ))
                                        :
                                        <option></option>

                                }
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="openAmount" className="block text-sm/6 font-medium text-gray-900">Monto de apertura</label>
                        </div>
                        <div className="mt-2">
                            <input type="text" name="openAmount" id="openAmount" value={openAmount.openAmount} onChange={onInputChangeOpenAmount} required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type='submit' className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-cyan-600 group-hover:from-green-400 group-hover:to-cyan-600 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                            <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                                Abrir caja
                            </span>
                        </button>
                        <Link to={'/admin/cajas'} className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-yellow-500 to-orange-500 group-hover:from-yellow-500 group-hover:to-orange-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
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

export default OpenCashRegister
