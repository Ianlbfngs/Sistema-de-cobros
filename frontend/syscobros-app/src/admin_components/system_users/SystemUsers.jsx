import axios from 'axios';
import React, { useEffect, useState } from 'react'
import UserFilters from '/src/public_components/filters/UserFilters.jsx'
import { verifyBackendStatus } from '/src/shared/utils/backendStatus';
import { Link } from 'react-router-dom';

function SystemUsers() {
    const [apiOnline, setApiOnline] = useState(true);

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const run = async () => {
            const backendOK = await verifyBackendStatus(setApiOnline);
            if (backendOK) {
                try {
                    setLoading(true);
                    const resultUsers = await axios.get("http://localhost:8080/api/admin/authentication/all", { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
                    setUsers(resultUsers.data);
                } catch (error) {
                    console.error("Error fetching users:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        run();
    }, []);

    //filtro
    const [filters, setFilters] = useState({
        id: "",
        storeName: "",
        username: "",
        name: "",
        role: ""

    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    //condiciones filtro
    const filteredUsers = Array.isArray(users)
        ? users.filter(user => {
            const conditions = [
                !filters.id || user.id === Number(filters.id),
                !filters.storeName || user.store?.name.toLowerCase().includes(filters.storeName.toLowerCase()),
                !filters.username || user.username.toLowerCase().includes(filters.username.toLowerCase()),
                !filters.name || user.referenceName.toLowerCase().includes(filters.name.toLowerCase()),
                !filters.role || user.role === filters.role
            ];
            return conditions.every(Boolean);
        })
        : [];


    //paginado
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil((filteredUsers?.length || 0) / itemsPerPage);

    function renderUsers() {
        if (loading) {
            return (
                <tr className="table-body-row">
                    <td colSpan={7} className="text-center p-3 ">
                        Cargando datos...
                    </td>
                </tr>
            );
        }
        if (currentUsers.length === 0) {
            return (
                <tr className="table-body-row">
                    <td colSpan={7} className="text-center p-3 text-red-400">
                        No se encotraron proveedores en la base de datos
                    </td>
                </tr>
            );
        }
        try {
            return (

                currentUsers.map((user, index) => (
                    <tr key={index} className="table-body-row">
                        <td className="table-cell">{user.id}</td>
                        <td className="table-cell">{user.store?.name || "N/A"}</td>
                        <td className="table-cell">{user.username}</td>
                        <td className="table-cell">{user.referenceName}</td>
                        <td className="table-cell">{user.role}</td>
                        <td className="py-3">
                            <div>
                                <Link to={`edit/${user.id}`} className="table-cell-link group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                    <span className="table-cell-link-span">
                                        Editar informacion
                                    </span>
                                </Link>
                            </div>
                        </td>
                        <td className="py-3 ">
                            <div>
                                <Link to={`updatePassword/${user.id}`} className="table-cell-link group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                                    <span className="table-cell-link-span">
                                        Actualizar contraseña
                                    </span>
                                </Link>
                            </div>
                        </td>
                    </tr>
                ))

            )
        } catch (error) {
            console.error("Error loading users:", error);
            return (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                    <td colSpan={7} className='text-center p-3 text-red-400'  >Error cargando los usuarios</td>
                </tr>
            )
        }
    }

    return (
        <div className="relative overflow-x-auto">
            <div className="mt-2 mb-4">
                <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-2">
                    Listado de usuarios
                </h3>
            </div>
            <div>
                <UserFilters filters={filters} handleFilterChange={handleFilterChange} setFilters={setFilters} />
            </div>
            <table className="table">
                <thead className="table-head">
                    <tr>
                        <th scope="col" className="table-cell">ID</th>
                        <th scope="col" className="table-cell">Local</th>
                        <th scope="col" className="table-cell">Usuario</th>
                        <th scope="col" className="table-cell">Nombre</th>
                        <th scope="col" className="table-cell">Rol</th>
                        <th scope="col" className="table-cell"></th>
                        <th scope="col" className="table-cell"></th>


                    </tr>
                </thead>
                <tbody>
                    {renderUsers()}
                </tbody>
            </table>
            {/* Footer */}
            <div className="table-footer">
                <nav className="flex justify-center p-3">
                    <ul className="inline-flex space-x-px text-sm">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i + 1}>
                                <button
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`table-footer-page-button ${currentPage === i + 1
                                        ? "table-footer-page-button-selected"
                                        : "table-footer-page-button-unselected"}`}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            {!apiOnline && (
                <div className="error-message-1" role='alert'>
                    <span>Error: No fue posible establecer conexion con el sistema de cobros</span>
                </div>
            )}
        </div>
    )
}

export default SystemUsers
