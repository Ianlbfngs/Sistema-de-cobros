import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { verifyBackendStatus } from '/src/shared/utils/backendStatus';
import { useTemporaryAlert } from '../../shared/utils/useTemporaryAlert';
import { Link, useParams } from 'react-router-dom';


function CloseCashRegister() {
    const [apiOnline, setApiOnline] = useState(true);

    const { cashRegisterID } = useParams();

    const [closeAmount, setCloseAmount] = useState(0);

    const [cashRegister, setCashRegister] = useState({
        id: 0,
        store: {
            id: 0,
            name: ""
        },
        openDateTime: "",
        openAmount: "",
        totalWithdrawnAmount: "",
        totalReceivedAmount: "",
        openingUserName: ""

    });

    const { id, store, openDateTime, openAmount, totalWithdrawnAmount, totalReceivedAmount, openingUserName } = cashRegister;

    const [loading, setLoading] = useState(true);
    const [errorLoadingCashRegister, setErrorLoadingCashRegister] = useState(false);
    const { visibleSuccessAlert, showSuccessAlert } = useTemporaryAlert("/admin/cajas");
    const [errorMessage, setErrorMessage] = useState("");


    useEffect(() => {
        const run = async () => {
            const backendOK = await verifyBackendStatus(setApiOnline);
            if (backendOK) {
                setLoading(true);
                try {
                    const resultCashRegister = await axios.get(`http://localhost:8080/api/cashRegisters/${cashRegisterID}`, { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
                    setCashRegister(resultCashRegister.data);
                    setErrorLoadingCashRegister(false);
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
    }, []);


    const onInputChangeCloseAmount = (e) => {
        const { name, value } = e.target;
        setCloseAmount(parseFloat(value));

    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        if (! await verifyBackendStatus(setApiOnline)) return; //cancela el submit si no se puede establecer conexion con el sistema
        try {
            await axios.post(`http://localhost:8080/api/cashRegisters/close/${store.id}`, closeAmount, { headers: { Authorization: 'Bearer ' + localStorage.getItem('jwtToken'), 'Content-Type': 'application/json' } }); //abre la caja
            showSuccessAlert();
        } catch (error) {
            alert("Hubo un error al intentar cerrar la caja");
            console.log(closeAmount)
            console.error(error);
            setErrorMessage(
                typeof error.response?.data === 'string'
                    ? error.response.data
                    : error.response?.data?.error || error.message || "Error desconocido"
            );
        }
    }

    function renderCashRegister() {
        if (loading) {
            return (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-center">
                    <td colSpan={8} className="text-center p-3 ">
                        Cargando datos...
                    </td>
                </tr>
            );
        }
        try {
            if (cashRegister.length === 0) {
                return (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-center">
                        <td colSpan={10} className="text-center p-3 text-red-400">
                            No se encontro la caja solicitada en la base de datos
                        </td>
                    </tr>
                );
            }
            return (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-center">

                    <td scope='row' className="px-6 py-3">{id}</td>
                    <td scope='row' className="px-6 py-3">{store.name}</td>
                    <td scope='row' className="px-6 py-3">{openDateTime}</td>
                    <td scope='row' className="px-6 py-3">{openAmount?.toLocaleString("es-AR") + " $"}</td>
                    <td scope='row' className="px-6 py-3">{totalWithdrawnAmount?.toLocaleString("es-AR") + " $"}</td>
                    <td scope='row' className="px-6 py-3">{totalReceivedAmount?.toLocaleString("es-AR") + " $"}</td>
                    <td scope='row' className="px-6 py-3">{openingUserName}</td>
                    <td scope='row' className='px-6 py-3 text-green-400'>Abierta</td>
                </tr>
            )
        } catch (error) {
            console.error("Error loading cash register:", error);
            return (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-center">
                    <td colSpan={8} className="text-center p-3 text-red-400">
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
                    Cerrar caja
                </h3>
            </div>
            {visibleSuccessAlert && (
                <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 " role="alert">
                    <div className="absolute top-0 left-0 h-1 bg-green-700 w-full progress-bar"></div>
                    <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <div>
                        <span className="font-medium">Caja cerrada exitosamente</span>
                    </div>
                </div>
            )}
            {(errorMessage !== "") && (
                <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 " role="alert">
                    <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <div>
                        <span className="font-medium">No fue posible cerrar la caja: {errorMessage}</span>
                    </div>
                </div>
            )}
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={(e) => onSubmit(e)} >
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="closeAmount" className="block text-sm/6 font-medium text-gray-900">Monto de cierre</label>
                        </div>
                        <div className="mt-2">
                            <input type="text" name="closeAmount" id="closeAmount" value={closeAmount} onChange={onInputChangeCloseAmount} required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type='submit' className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-cyan-600 group-hover:from-green-400 group-hover:to-cyan-600 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                            <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                                Cerrar caja
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
            <div className="mt-10 ">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center">
                        <tr>
                            <th scope='row' className="px-6 py-3">ID</th>
                            <th scope='row' className="px-6 py-3">Local</th>
                            <th scope='row' className="px-6 py-3">Hora de apertura</th>
                            <th scope='row' className="px-6 py-3">Monto de apertura</th>
                            <th scope='row' className="px-6 py-3">Total retirado</th>
                            <th scope='row' className="px-6 py-3">Total ingresado</th>
                            <th scope='row' className="px-6 py-3">Usuario apertura</th>
                            <th scope='row' className='px-6 py-3'>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {errorLoadingCashRegister ?
                            (<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-center">
                                <td colSpan={8} className="text-center p-3 text-red-400">
                                    Error cargando la caja solicitada
                                </td>
                            </tr>)
                            : renderCashRegister()}
                    </tbody>
                </table>
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

export default CloseCashRegister
