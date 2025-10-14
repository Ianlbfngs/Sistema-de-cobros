import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { verifyBackendStatus } from '/src/shared/utils/backendStatus';
import { useTemporaryAlert } from '../../shared/utils/useTemporaryAlert';
import { Link } from 'react-router-dom';


function DoCashMovement() {
    const [apiOnline, setApiOnline] = useState(true);

    const [cashMovement, setCashMovement] = useState({
        cashRegister: { id: "" },
        movementType: "",
        amount: "",
        concept: ""
    });

    const { cashRegister, movementType, amount, concept } = cashMovement;
    const [cashRegisters, setCashRegisters] = useState([]);

    const { visibleSuccessAlert, showSuccessAlert } = useTemporaryAlert("/admin/cajas");
    const [errorMessage, setErrorMessage] = useState("");


    useEffect(() => {
        const run = async () => {
            const backendOK = await verifyBackendStatus(setApiOnline);
            if (backendOK) {
                try {
                    const resultCashRegisters = await axios.get('http://localhost:8080/api/cashRegisters/all/open', { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
                    setCashRegisters(resultCashRegisters.data);
                } catch (error) {
                    console.error("Error fetching the cash registers data :", error);
                }
            }
        };

        run();
    }, []);

    const onInputChangeMovement = (e) => {
        const { name, value } = e.target;
        if (name === "cashRegisterDDL") {
            setCashMovement(prev => ({
                ...prev,
                cashRegister: { ...prev.cashRegister, id: parseInt(value) }
            }));
        } else if (name === "amount") {
            let amountValue = value.replaceAll(",", ".");
            setCashMovement(prev => ({
                ...prev,
                [name]: amountValue
            }));
        } else {
            setCashMovement(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        if (! await verifyBackendStatus(setApiOnline)) return;
        if (cashRegister.id === "") {
            alert("Seleccione una caja para realizar el movimiento");
            return;
        }
        if (movementType === "") {
            alert("Seleccione un tipo de movimiento");
            return;
        }
        try {
            await axios.post(`http://localhost:8080/api/cashMovements/add`, cashMovement, { headers: { Authorization: 'Bearer ' + localStorage.getItem('jwtToken') } });
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
                    Realizar movimiento de dinero
                </h3>
            </div>
            {visibleSuccessAlert && (
                <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 " role="alert">
                    <div className="absolute top-0 left-0 h-1 bg-green-700 w-full progress-bar"></div>
                    <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <div>
                        <span className="font-medium">Movimiento realizado exitosamente</span>
                    </div>
                </div>
            )}
            {(errorMessage !== "") && (
                <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 " role="alert">
                    <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <div>
                        <span className="font-medium">No fue posible realizar el movimiento: {errorMessage}</span>
                    </div>
                </div>
            )}
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={(e) => onSubmit(e)} >
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="cashRegisterDDL" className="block text-sm/6 font-medium text-gray-900">Caja</label>
                        </div>
                        <select name="cashRegisterDDL" id="cashRegisterDDL" value={cashRegister.id} onChange={onInputChangeMovement} className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'>
                            <option value={""}>Seleccione una caja para realizar el movimiento</option>
                            {
                                Array.isArray(cashRegisters)
                                    ?
                                    cashRegisters.map((cashRegister, index) => (
                                        <option key={cashRegister.id} value={cashRegister.id} className="text-green-500" >{cashRegister.id} * Caja abierta </option>
                                    ))
                                    :
                                    ""

                            }
                        </select>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="movementType" className="block text-sm/6 font-medium text-gray-900">Tipo de movimiento</label>
                        </div>
                        <div className='mt-2'>
                            <select name="movementType" id="movementType" value={movementType} onChange={onInputChangeMovement} className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'>
                                <option value={""}>Seleccione un tipo de movimiento</option>
                                <option value={"INGRESO"}>INGRESO</option>
                                <option value={"RETIRO"}>RETIRO</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="amount" className="block text-sm/6 font-medium text-gray-900">Monto</label>
                        </div>
                        <div className="mt-2">
                            <input type="number" name="amount" id="amount" value={amount} onChange={onInputChangeMovement} required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="concept" className="block text-sm/6 font-medium text-gray-900">Concepto</label>
                        </div>
                        <div className="mt-2">
                            <input type="text" name="concept" id="concept" value={concept} maxLength={100} onChange={onInputChangeMovement} required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type='submit' className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-cyan-600 group-hover:from-green-400 group-hover:to-cyan-600 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                            <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                                Agregar producto
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

export default DoCashMovement
