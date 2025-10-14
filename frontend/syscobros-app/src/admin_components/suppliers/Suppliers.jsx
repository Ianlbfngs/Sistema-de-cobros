import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SuppliersFilters from '/src/public_components/filters/SuppliersFilters.jsx';
import { verifyBackendStatus } from '/src/shared/utils/backendStatus';
import { Link } from 'react-router-dom';

function Suppliers() {
  const [apiOnline, setApiOnline] = useState(true);

  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);

  const [errorLoadingSuppliers, setErrorLoadingSuppliers] = useState(false);


  useEffect(() => {
    const run = async () => {
      const backendOK = await verifyBackendStatus(setApiOnline);
      if (backendOK) {
        try {
          setLoading(true);
          const resultSuppliers = await axios.get("http://localhost:8080/api/suppliers/all", { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
          setSuppliers(resultSuppliers.data);
          setErrorLoadingSuppliers(false);

        } catch (error) {
          console.error("Error fetching suppliers:", error);
          setErrorLoadingSuppliers(true);
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
    name: "",
    cuit: "",
    phone: "",
    email: "",
    address: ""

  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  //condiciones filtro
  const filteredSuppliers = Array.isArray(suppliers)
    ? suppliers.filter(supplier => {
      const conditions = [
        !filters.id || supplier.id === Number(filters.id),
        !filters.name || supplier.companyName.toLowerCase().includes(filters.name.toLowerCase()),
        !filters.cuit || supplier.cuit.includes(filters.cuit),
        !filters.phone || supplier.phoneNumber.includes(filters.phone),
        !filters.email || supplier.email?.toLowerCase().includes(filters.email),
        !filters.address || supplier.address?.toLowerCase().includes(filters.address)

      ];
      return conditions.every(Boolean);
    })
    : [];


  //paginado
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil((filteredSuppliers?.length || 0) / itemsPerPage);

  function renderSuppliers() {
    if (loading.suppliers) {
      return (
        <tr className="table-body-row">
          <td colSpan={7} className="text-center p-3 ">
            Cargando datos...
          </td>
        </tr>
      );
    }
    try {
      if (currentSuppliers.length === 0) {
        return (
          <tr className="table-body-row">
            <td colSpan={7} className="text-center p-3 text-red-400">
              No se encotraron proveedores en la base de datos
            </td>
          </tr>
        );
      }
      return currentSuppliers.map((supplier, index) => (
        <tr key={index} className="table-body-row">
          <td className="table-cell">{supplier.id}</td>
          <td className="table-cell">{supplier.companyName}</td>
          <td className="table-cell">{supplier.cuit}</td>
          <td className="table-cell">{supplier.phoneNumber}</td>
          <td className="table-cell">{supplier.email || "N/A"}</td>
          <td className="table-cell">{supplier.address || "N/A"}</td>
          <td className=" py-3">
            <div className=''>
              <Link to={`edit/${supplier.id}`} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                <span className="relative px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                  Editar informacion
                </span>
              </Link>
            </div>
          </td>

        </tr>
      ))
    } catch (error) {
      console.error("Error loading suppliers:", error);
      return;
    }
  }

  return (
    <div className="relative overflow-x-auto">
      <div className="mt-2 mb-4">
        <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-2">
          Listado de proveedores
        </h3>
      </div>
      <div>
        <SuppliersFilters filters={filters} handleFilterChange={handleFilterChange} setFilters={setFilters} />

      </div>
      <table className="table">
        <thead className="table-head">
          <tr>
            <th scope="col" className="table-cell">ID</th>
            <th scope="col" className="table-cell">Razón Social</th>
            <th scope="col" className="table-cell">CUIT</th>
            <th scope="col" className="table-cell">Teléfono</th>
            <th scope="col" className="table-cell">Correo</th>
            <th scope="col" className="table-cell">Dirección</th>
            <th scope="col" className="table-cell"></th>
          </tr>
        </thead>
        <tbody>

          {errorLoadingSuppliers ? (
            <tr className="table-body-row">
              <td colSpan={7} className="text-center p-3 text-red-400">
                Error cargando los proveedores
              </td>
            </tr>
          )
            : renderSuppliers()
          }
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
      {!apiOnline && (
        <div className="error-message-1" role='alert'>
          <span>Error: No fue posible establecer conexion con el sistema de cobros</span>
        </div>
      )}
    </div>
  )
}

export default Suppliers
