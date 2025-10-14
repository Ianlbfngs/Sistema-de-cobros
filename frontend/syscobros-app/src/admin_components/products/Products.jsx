import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { verifyBackendStatus } from '/src/shared/utils/backendStatus';
import ProductFilters from '/src/public_components/filters/ProductFilters.jsx'
import { Link } from 'react-router-dom';

function Products() {
    const [apiOnline, setApiOnline] = useState(true);


    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorLoadingProducts, setErrorLoadingProducts] = useState(false);
    useEffect(() => {
        const run = async () => {
            const backendOK = await verifyBackendStatus(setApiOnline);
            if (backendOK) {
                try {
                    setLoading(true);
                    const resultProducts = await axios.get("http://localhost:8080/api/products/all", { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
                    setProducts(resultProducts.data);
                    setErrorLoadingProducts(false);

                } catch (error) {
                    console.error("Error fetching products:", error);
                    setErrorLoadingProducts(true);
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
        code: "",
        supplier: "",
        name: "",
        price: ""
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    //condiciones filtro
    const filteredProducts = Array.isArray(products)
        ? products.filter(product => {
            const conditions = [
                !filters.code || product.productCode.toLowerCase().includes(filters.code.toLowerCase()),
                !filters.supplier || product.supplier?.companyName.toLowerCase().includes(filters.supplier.toLowerCase()),
                !filters.name || product.name.toLowerCase().includes(filters.name.toLowerCase()),
                !filters.price || product.price === Number(filters.price),
            ];
            return conditions.every(Boolean);
        })
        : [];


    //paginado
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);

    function renderProducts() {
        if (loading) {
            return (
                <tr className="table-body-row">
                    <td colSpan={6} className="text-center p-3 ">
                        Cargando datos...
                    </td>
                </tr>
            );
        }
        try {
            if (currentProducts.length === 0) {
                return (
                    <tr className="table-body-row">
                        <td colSpan={6} className="text-center p-3 text-red-400">
                            No se encotraron productos en la base de datos
                        </td>
                    </tr>
                );
            }
            return currentProducts.map((product, index) => (
                <tr key={index} className="table-body-row">
                    <td className="table-cell">{product.productCode}</td>
                    <td className="table-cell">{product.supplier?.companyName || "N/A"}</td>
                    <td className="table-cell">{product.name}</td>
                    <td className="table-cell">{product.price?.toLocaleString("es-AR") + " $"}</td>
                    <td className="table-cell">{product.description}</td>
                    <td className=" py-3">
                        <Link to={`edit/${product.productCode}`} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                            <span className="relative px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                Editar producto
                            </span>
                        </Link>
                    </td>

                </tr>
            ))
        } catch (error) {
            console.error("Error loading products:", error);
            return (
                <tr className="table-body-row">
                    <td colSpan={6} className="text-center p-3 text-red-400">
                        Error cargando los productos
                    </td>
                </tr>
            )
        }
    }

    return (
        <div className="relative overflow-x-auto">
            <div className="mt-2 mb-4">
                <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-2">
                    Listado de productos
                </h3>
            </div>
            <div>
                <ProductFilters filters={filters} handleFilterChange={handleFilterChange} setFilters={setFilters} />

            </div>
            <table className="table">
                <thead className="table-head">
                    <tr>
                        <th scope="col" className="table-cell">Codigo de Producto</th>
                        <th scope="col" className="table-cell">Proveedor</th>
                        <th scope="col" className="table-cell">Nombre</th>
                        <th scope="col" className="table-cell">Precio Unitario</th>
                        <th scope="col" className="table-cell">Descripción</th>
                        <th scope="col" className="table-cell"></th>
                    </tr>
                </thead>
                <tbody>
                    {errorLoadingProducts ?
                        (<tr className="table-body-row">
                            <td colSpan={6} className="text-center p-3 text-red-400">
                                Error cargando los productos
                            </td>
                        </tr>)
                        : renderProducts()}
                </tbody>
            </table>

            {/* Footer  */}
            <div className="w-full flex justify-center border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <nav className="flex justify-center p-3">
                    <ul className="inline-flex -space-x-px text-sm">
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
            {/* mensaje api offline */}
            {!apiOnline && (
                <div className="error-message-1" role='alert'>
                    <span>Error: No fue posible establecer conexion con el sistema de cobros</span>
                </div>
            )}
        </div>
    )
}

export default Products
