import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'
import {verifyBackendStatus} from './utils/backendStatus';
import '../index.css';

export default function Login({ setRole }) {

    const navigate = useNavigate();



    useEffect(() => {
        setRole(null);
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("role");
    }, []);

    const [apiOnline, setApiOnline] = useState(true);
    const [loginSuccessful, setLoginSuccessful] = useState(true);


    const [credential, setCredential] = useState({
        username: "",
        password: ""
    });

    const { username, password } = credential

    const onInputChangeCredential = (e) => {
        const { name, value } = e.target;
        setCredential(prev => ({
            ...prev,
            [name]: value
        }));
    };



    const onSubmit = async (e) => {
        e.preventDefault();
        if (await verifyBackendStatus(setApiOnline)) {
            try {
                const result = await axios.post("http://localhost:8080/api/public/authentication/login", credential);

                localStorage.setItem("jwtToken", result.data.token);
                localStorage.setItem("role", result.data.role);

                setRole(result.data.role);

                setLoginSuccessful(true);
                navigate("/admin/menu");

            } catch (error) {
                console.log(error.message);
                console.log(error.response?.data?.error);
                setLoginSuccessful(false);
            }
        }
    }

    return (

        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sistema de Cobros</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={(e) => onSubmit(e)}>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="username" className="login-field-label">Usuario</label>
                        </div>
                        <div className="mt-2">
                            <input type="text" name="username" id="username" value={username} onChange={onInputChangeCredential} required className="login-field-input" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="login-field-label">Contraseña</label>
                        </div>
                        <div className="mt-2">
                            <input type="password" name="password" id="password" value={password} onChange={onInputChangeCredential} required className="login-field-input" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Iniciar Sesión</button>
                    </div>
                </form>
            </div>
            {!apiOnline && (
                <div className="error-message-1" role='alert'>
                    <span>Error: No fue posible establecer conexion con el sistema de cobros</span>
                </div>
            )}
            {!loginSuccessful && (
                <div className="error-message-1" role='alert'>
                    <span>Usuario o contraseña incorrectos</span>
                </div>
            )
            }
        </div>
    )
}
