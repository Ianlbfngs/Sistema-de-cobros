import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { verifyBackendStatus } from '/src/shared/utils/backendStatus';
import SaleDetailsFilters from '/src/public_components/filters/SaleDetailsFilters.jsx'
import { Link, useParams } from 'react-router-dom';

function SaleDetail() {
  const [apiOnline, setApiOnline] = useState(true);

  const { saleID } = useParams();

  const [loading, setLoading] = useState(true);
  const [sale, setSale] = useState([]);
  const [errorLoadingSale, setErrorLoadingSale] = useState(false);


  useEffect(() => {
    const run = async () => {
      const backendOK = await verifyBackendStatus(setApiOnline);
      if (backendOK) {
        try {
          setLoading(true);
          const resultSale = await axios.get(`http://localhost:8080/api/sales/${saleID}`, { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
          setSale(resultSale.data);
          setErrorLoadingSale(false);
        } catch (error) {
          console.error(`Error fetching sale with id ${saleID}:`, error);
          setErrorLoadingSale(true);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    run();
  }, []);



  function renderSale() {
    if (loading) {
      return (
        <tr className="table-body-row">
          <td colSpan={7} className="text-center p-3 ">
            Cargando datos...
          </td>
        </tr>
      );
    }
    try {
      return (
        <tr className='table-body-row'>
          <td className="table-cell">{sale.id}</td>
          <td className="table-cell">{sale.referenceName + " | ID:" + sale.userId}</td>
          <td className="table-cell">{sale.detail?.email || "N/A"}</td>
          <td className="table-cell">{sale.paymentMethod?.method}</td>
          <td className="table-cell">{sale.dateTime}</td>
          <td className="table-cell">{sale.total?.toLocaleString("es-AR") + " $"}</td>
          <td className="table-cell">{sale.status}</td>
        </tr>
      )
    } catch (error) {
      console.error("Error loading sales:", error);
      console.log(error);
      return (
        <tr className="table-body-row">
          <td colSpan={6} className="text-center p-3 text-red-400">
            Error cargando la venta
          </td>
        </tr>
      )
    }
  }

  //filtro
  const [filters, setFilters] = useState({
    code: "",
    amount: 0
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  //condiciones filtro
  const filteredDetails = Array.isArray(sale.details)
    ? sale.details.filter(detail => {
      const conditions = [
        !filters.code || detail.product.productCode?.toLowerCase().includes(filters.code.toLowerCase()),
        !filters.amount || detail.amount === Number(filters.amount),
      ];
      return conditions.every(Boolean);
    })
    : [];

  //paginado
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDetails = filteredDetails?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil((filteredDetails?.length || 0) / itemsPerPage);

  function renderDetails() {
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
      return currentDetails.length === 0 ? (
        <tr className="table-body-row">
          <td colSpan={5} className="text-center p-3 text-red-400">
            No hay coincidencias
          </td>
        </tr>
      ) : (currentDetails.map((detail, index) => (
        <tr key={index} className="table-body-row">

          <td className="table-cell">{detail.product.productCode}</td>
          <td className="table-cell">{detail.product.name}</td>
          <td className="table-cell">{detail.product.price?.toLocaleString("es-AR") + " $"}</td>
          <td className="table-cell">{detail.amount}</td>
          <td className="table-cell">{(parseFloat(detail.amount * detail.product.price))?.toLocaleString("es-AR") + " $"}</td>
        </tr>
      )))
    } catch (error) {
      console.log(error);
      return (
        <tr className="table-body-row">
          <td colSpan={5} className="text-center p-3 text-red-400">
            Error cargando los detalles
          </td>
        </tr>
      )
    }
  }
  return (
    <div className="relative overflow-x-auto">
      <div className="mt-2 mb-2">
        <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-500 pb-2">
          Venta
        </h3>
      </div>
      <table className="table">
        <thead className="table-head">
          <tr>
            <th scope='col' className="table-cell">ID</th>
            <th scope='col' className="table-cell">Cajero</th>
            <th scope='col' className="table-cell">Cliente</th>
            <th scope='col' className='table-cell'>Metodo de pago</th>
            <th scope='col' className='table-cell'>Fecha</th>
            <th scope='col' className='table-cell'>Total</th>
            <th scope='col' className='table-cell'>Estatus</th>
          </tr>
        </thead>
        <tbody>
          {errorLoadingSale ?
            (<tr className="table-body-row">
              <td colSpan={6} className="text-center p-3 text-red-400">
                Error cargando la venta
              </td>
            </tr>)
            : renderSale()}
        </tbody>
      </table>
      <div className="mt-2 mb-2">
        <h3 className="text-2xl font-bold text-gray-800 border-b-2 pt-1 border-indigo-500 pb-2">
          Detalles de venta
        </h3>
      </div>
      <div className='mb-5'>
        <SaleDetailsFilters filters={filters} handleFilterChange={handleFilterChange} setFilters={setFilters} />
      </div>
      <table className="table">
        <thead className="table-head">
          <tr>
            <th scope='col' className="table-cell">Codigo de producto</th>
            <th scope='col' className="table-cell">Nombre</th>
            <th scope='col' className='table-cell'>Precio</th>
            <th scope='col' className='table-cell'>Cantidad / Peso en Kg</th>
            <th scope='col' className='table-cell'>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {renderDetails()}
        </tbody>
      </table>
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
      {/* Botone de volver*/}
      <div className="flex m-10">
        <Link to={'/admin/ventas'} className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-yellow-500 to-orange-500 group-hover:from-yellow-500 group-hover:to-orange-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
          <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
            Volver
          </span>
        </Link>
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

export default SaleDetail
