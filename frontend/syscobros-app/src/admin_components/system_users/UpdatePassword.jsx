import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { verifyBackendStatus } from '/src/shared/utils/backendStatus';
import { useTemporaryAlert } from '../../shared/utils/useTemporaryAlert';
import { Link, useParams, useNavigate } from 'react-router-dom';

function UpdatePassword() {

    const navigate = useNavigate();
    const { idUser } = useParams();

    const [repeatedPassword, setRepeatedPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatedPassword, setShowRepeatedPassword] = useState(false);


    const [apiOnline, setApiOnline] = useState(true);

    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    const { username, password } = user;

    const { visibleSuccessAlert, showSuccessAlert } = useTemporaryAlert("/admin/usuarios");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const run = async () => {
            const backendOK = await verifyBackendStatus(setApiOnline);
            if (backendOK) {
                try {
                    const resultUsers = await axios.get(`http://localhost:8080/api/admin/authentication/${idUser}`, { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
                    setUser(resultUsers.data);
                } catch (error) {
                    console.error("Error fetching the user with id '" + idUser + "' :", error);
                    if (error.status === 404) {
                        alert("El usuario con id '" + idUser + "' no existe en el sistema");
                        navigate("/admin/usuarios");

                    }
                }
            }
        };

        run();
    }, []);

    const checkPasswordsMatch = (pass1, pass2) => {
        setPasswordsMatch(pass1 === pass2);
    };

    const onPasswordChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, password: value }));

        checkPasswordsMatch(value, repeatedPassword);
    };

    const onInputChangeVerifyPassword = (e) => {
        setRepeatedPassword(e.target.value);
        checkPasswordsMatch(password, e.target.value);

    };


    const onSubmit = async (e) => {
        e.preventDefault();
        if (! await verifyBackendStatus(setApiOnline)) return;
        if (!passwordsMatch) return;
        try {
            await axios.put(`http://localhost:8080/api/admin/authentication/updatePassword`, user, { headers: { Authorization: 'Bearer ' + localStorage.getItem('jwtToken'), 'Content-Type': 'application/json' } });
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
                    Actualizar contraseña
                </h3>
            </div>
            {visibleSuccessAlert && (
                <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 " role="alert">
                    <div className="absolute top-0 left-0 h-1 bg-green-700 w-full progress-bar"></div>
                    <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <div>
                        <span className="font-medium">Contraseña actualizada correctamente</span>
                    </div>
                </div>
            )}
            {(errorMessage !== "") && (
                <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 " role="alert">
                    <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <div>
                        <span className="font-medium">No fue posible actualizar la contraseña: {errorMessage}</span>
                    </div>
                </div>
            )}
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={(e) => onSubmit(e)} >
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
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Nueva contraseña</label>
                        </div>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} name="password" id="password" value={password || ""} onChange={onPasswordChange} maxLength={45} required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-indigo-600 focus:outline-none">
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-10-7-10-7a17.896 17.896 0 014.106-4.81M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1L17.9 17.9" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0s-3-7-9-7-9 7-9 7 3 7 9 7 9-7 9-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="repeatPassword" className="block text-sm/6 font-medium text-gray-900">Repita la contraseña {!passwordsMatch && <p className="text-red-500 text-sm">Las contraseñas no coinciden</p>}</label>
                        </div>
                        <div className="relative">
                            <input type={showRepeatedPassword ? "text" : "password"} name="repeatPassword" id="repeatPassword" value={repeatedPassword} onChange={onInputChangeVerifyPassword} maxLength={45} required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            <button type="button" onClick={() => setShowRepeatedPassword((prev) => !prev)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-indigo-600 focus:outline-none">
                                {showRepeatedPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-10-7-10-7a17.896 17.896 0 014.106-4.81M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1L17.9 17.9" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0s-3-7-9-7-9 7-9 7 3 7 9 7 9-7 9-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button type='submit' className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-cyan-600 group-hover:from-green-400 group-hover:to-cyan-600 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                            <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                                Cambiar contraseña
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

export default UpdatePassword
