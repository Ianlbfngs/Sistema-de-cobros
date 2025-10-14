import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import { verifyBackendStatus } from '/src/shared/utils/backendStatus';
import { useTemporaryAlert } from '../../shared/utils/useTemporaryAlert';
import { Link, useParams, useNavigate } from 'react-router-dom';


function EditUser() {
    const navigate = useNavigate();
    const { idUser } = useParams();

    const [apiOnline, setApiOnline] = useState(true);

    const [user, setUser] = useState({
        id: 0,
        username: "",
        store: { id: 0, name: "" },
        referenceName: "",
        role: ""
    });

    const [storesddl, setStoresDdl] = useState([]);

    const { id, username, store, referenceName, role } = user;

    const { visibleSuccessAlert, showSuccessAlert } = useTemporaryAlert("/admin/usuarios");
    const [errorMessage, setErrorMessage] = useState("");

    const [errorRole, setErrorRole] = useState(false);

    useEffect(() => {
        const run = async () => {
            const backendOK = await verifyBackendStatus(setApiOnline);
            if (backendOK) {
                try {
                    const resultUsers = await axios.get(`http://localhost:8080/api/admin/authentication/${idUser}`, { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
                    setUser(resultUsers.data);
                    try {
                        const resultStoresDdl = await axios.get('http://localhost:8080/api/stores/all', { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
                        setStoresDdl(resultStoresDdl.data);
                    } catch (error) {
                        console.error("Error fetching the stores data :", error);
                    }
                } catch (error) {
                    console.error("Error fetching the user with id '" + idUser + "' :", error);
                    if (error.status === 404) {
                        alert("El usuario con id '" + idUser + "' no existe en el sistema");
                    }
                    alert("Error intentando obtener el usuario con id '" + idUser + "'");
                    alert("Codigo de error: " + error.code);
                    navigate("/admin/usuarios");
                }
            }
        };

        run();
    }, []);

    const onInputChangeUser = (e) => {
        const { name, value } = e.target;
        if (name === "storeDdl") {
            setUser(prev => ({
                ...prev,
                store: { ...prev.store, id: parseInt(value) }
            }));
        } else {
            if (name === "role") setErrorRole(false);
            setUser(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        if (! await verifyBackendStatus(setApiOnline)) return;
        if (store.id === -1) {
            alert("Seleccione una opcion para el local");
            return;
        }
        if (role === "N/A") {
            setErrorRole(true);
            return;
        }
        try {
            await axios.put(`http://localhost:8080/api/admin/authentication/update/${username}`, user, { headers: { Authorization: 'Bearer ' + localStorage.getItem('jwtToken') } });
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
                    Editar usuario
                </h3>
            </div>
            {visibleSuccessAlert && (
                <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 " role="alert">
                    <div className="absolute top-0 left-0 h-1 bg-green-700 w-full progress-bar"></div>
                    <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <div>
                        <span className="font-medium">Usuario actualizado correctamente</span>
                    </div>
                </div>
            )}
            {(errorMessage !== "") && (
                <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 " role="alert">
                    <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <div>
                        <span className="font-medium">No fue posible actualizar el usuario: {errorMessage}</span>
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
                            <input type="text" name="id" id="id" value={id} disabled className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 cursor-not-allowed" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">Usuario</label>
                        </div>
                        <div className="mt-2">
                            <input type="text" name="username" id="username" value={username} disabled className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 cursor-not-allowed" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="storeDdl" className="block text-sm/6 font-medium text-gray-900">Local</label>
                        </div>
                        <div className="mt-2">
                            <select name="storeDdl" id="storeDdl" value={store?.id} onChange={onInputChangeUser} className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'>
                                <option value={-1}>Seleccione un local</option>
                                <option value={0}>N/A</option>
                                {
                                    Array.isArray(storesddl)
                                        ?
                                        storesddl.map((storeddl, index) => (
                                            <option key={index} value={storeddl.id}>{storeddl.name}</option>
                                        ))
                                        :
                                        <option></option>

                                }
                            </select>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="referenceName" className="block text-sm/6 font-medium text-gray-900">Nombre</label>
                        </div>
                        <div className="mt-2">
                            <input type="text" name="referenceName" id="referenceName" value={referenceName} maxLength={100} onInput={onInputChangeUser} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="roleDdl" className="block text-sm/6 font-medium text-gray-900">Rol {errorRole && (<span className='text-red-500  focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'>  *Seleccione un rol</span>)}</label>
                        </div>
                        <div className="mt-2">
                            <select name="role" id="roleDdl" value={role} onChange={onInputChangeUser} className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'>
                                <option value={"N/A"}>Seleccione un rol</option>
                                <option value={"ADMINISTRADOR"}>Administrador</option>
                                <option value={"GERENTE"}>Gerente</option>
                                <option value={"CAJERO"}>Cajero</option>

                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type='submit' className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-cyan-600 group-hover:from-green-400 group-hover:to-cyan-600 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                            <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                                Actualizar usuario
                            </span>
                        </button>
                        <Link to={'/admin/usuarios'} className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-yellow-500 to-orange-500 group-hover:from-yellow-500 group-hover:to-orange-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
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

export default EditUser
