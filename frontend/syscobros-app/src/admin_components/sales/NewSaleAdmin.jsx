import axios from 'axios';
import React, { use, useEffect, useState } from 'react'
import { verifyBackendStatus } from '/src/shared/utils/backendStatus';
import { useTemporaryAlert } from '../../shared/utils/useTemporaryAlert';
import { Link } from 'react-router-dom';


function NewSale() {
  const [apiOnline, setApiOnline] = useState(true);

  const [sale, setSale] = useState({
    client: {
      id: 0
    },
    paymentMethod: {
      id: 0
    },
    details: [],
    cashRegisterId: 0
  });

  const [clientID, setClientID] = useState(-1);
  const [storeID, setStoreID] = useState(0);
  const [productCode, setProductCode] = useState("");
  const [productAmount, setProductAmount] = useState(0);
  const [saleStatus, setSaleStatus] = useState("");
  const [saleTotal, setSaleTotal] = useState(0);

  const [productsDDL, setProductsDDL] = useState([]);
  const [clientsDDL, setClientsDDL] = useState([]);
  const [storesDDL, setStoresDDL] = useState([]);
  const { paymentMethod, cashRegisterId, details } = sale;

  const { visibleSuccessAlert, showSuccessAlert } = useTemporaryAlert("/admin/ventas");
  const [errorMessage, setErrorMessage] = useState("");

  //fetchs para los selects
  useEffect(() => {
    const run = async () => {
      const backendOK = await verifyBackendStatus(setApiOnline);
      if (backendOK) {
        try {
          const resultProducts = await axios.get('http://localhost:8080/api/products/all', { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
          setProductsDDL(resultProducts.data);
          try {
            const resultClients = await axios.get('http://localhost:8080/api/admin/clients/all', { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
            setClientsDDL(resultClients.data);
            try {
              const resultStores = await axios.get('http://localhost:8080/api/stores/all', { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
              setStoresDDL(resultStores.data);
            } catch (error) {
              console.error("Error fetching the stores data:", error);
            }
          } catch (error) {
            console.error("Error fetching the clients data:", error);
          }
        } catch (error) {
          console.error("Error fetching the products data:", error);
        }
      }
    };

    run();
  }, []); // <-- se ejecuta cuando se monta el componente

  //fetch de la caja abierta (en caso que haya) del local especificado
  useEffect(() => {
    if (storeID === 0) {
      setSale(prev => ({
        ...prev,
        cashRegisterId: 0
      }));
      return;
    }
    const fetchOpenCashRegister = async () => {
      const backendOK = await verifyBackendStatus(setApiOnline);
      if (backendOK) {
        try {
          const openCashRegister = await axios.get(`http://localhost:8080/api/cashRegisters/open/${storeID}`, { headers: { Authorization: 'Bearer ' + localStorage.getItem("jwtToken") } });
          setSale(prev => ({
            ...prev,
            cashRegisterId: openCashRegister.data?.id || 0
          }));
        } catch (error) {
          console.error("Error fetching the open cash register id:", error);
        }
      }
    };

    fetchOpenCashRegister();
  }, [storeID]); // <-- esto se ejecuta cuando se cambia el valor de storeID

  //oninputchages y onselectchanges de productamount, productcode, storeid, clientid, salestatus y sale
  const onInputChangeProductAmount = (e) => {
    const { name, value } = e.target;
    setProductAmount(parseFloat(value));
  };

  const onInputChangeProductCode = (e) => {
    const { name, value } = e.target;
    if (value === 0) {
      alert("Seleccione un producto")
      return;
    }
    setProductCode(value);
  };

  const onInputChangeStoreID = (e) => {
    const { name, value } = e.target;
    setStoreID(parseInt(value));
  };

  const onSelectionSaleStatus = (e) => {
    const { name, value } = e.target;
    setSaleStatus(value);
  };

  const onInputChangeClientID = (e) => {
    const { name, value } = e.target;
    setClientID(parseInt(value));
    if (value === "0") {
      //borra el cliente
      setSale(prev => {
        const { client, ...rest } = prev;
        return rest;
      });
    } else {
      setSale(prev => ({
        ...prev,
        client: { id: parseInt(value) }
      }));
    }
  };

  const onInputChangeSale = (e) => {
    const { name, value } = e.target;
    if (name === "paymentMethodDDL") {
      setSale(prev => ({
        ...prev,
        paymentMethod: { ...prev.paymentMethod, id: parseInt(value) }
      }));
    } else {
      setSale(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  //handler para añadir producto al detalle de sale
  const handleAddDetail = () => {
    if (productCode === 0) {
      alert("Debe elegir un producto");
      return;
    }
    if (productAmount <= 0) {
      alert("La cantidad/peso debe ser mayor a 0");
      return;
    }

    let productPrice = productsDDL.find(p => p.productCode === productCode)?.price;
    let productName = productsDDL.find(p => p.productCode === productCode)?.name;

    const newDetail = {
      product: { productCode: productCode, name: productName, price: productPrice },
      amount: productAmount
    };

    setSale(prev => ({
      ...prev,
      details: [...prev.details, newDetail]
    }));

    setSaleTotal(saleTotal + (productPrice * productAmount));
    //reseteo de los select
    setProductCode(0);
    setProductAmount(0);
  };

  //submit personalizado
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(sale);

    if (paymentMethod.id === 0) {
      alert("Seleccione un metodo de pago");
      return;
    }
    if (cashRegisterId === 0) {
      alert("Seleccione la caja en la cual se efectuara la venta");
      return;
    }
    if (saleStatus === "") {
      alert("Seleccione el estado de la venta");
      return;
    }
    if (details.length === 0) {
      alert("Agrege al menos 1 producto a la venta");
      return;
    }
    setErrorMessage("");
    if (! await verifyBackendStatus(setApiOnline)) return;
    try {
      await axios.post(`http://localhost:8080/api/sales/add/${saleStatus}`, sale, { headers: { Authorization: 'Bearer ' + localStorage.getItem('jwtToken') } });
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
          Nueva venta
        </h3>
      </div>
      {/* mensaje de exito */}
      {visibleSuccessAlert && (
        <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 " role="alert">
          <div className="absolute top-0 left-0 h-1 bg-green-700 w-full progress-bar"></div>
          <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div>
            <span className="font-medium">Venta creada correctamente</span>
          </div>
        </div>
      )}
      {/* mensaje de error */}
      {(errorMessage !== "") && (
        <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 " role="alert">
          <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">No fue posible crear la venta: {errorMessage}</span>
          </div>
        </div>
      )}
      {/*div para mitad y mitad*/}
      <div className="grid grid-cols-2 gap-10">
        {/*columma izquierda*/}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={(e) => onSubmit(e)} >
            {/* select con clientes (puede no haber) */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="storeDdl" className="block text-sm/6 font-medium text-gray-900">Cliente</label>
              </div>
              <div className="mt-2">
                <select name="clientDDL" id="clientDDL" value={clientID} onChange={onInputChangeClientID} className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'>
                  <option value={-1}>Seleccione un cliente</option>
                  <option value={0}>N/A</option>
                  {
                    Array.isArray(clientsDDL)
                      ?
                      clientsDDL.map((client, index) => (
                        <option key={index} value={client.id}>{client.name}</option>
                      ))
                      :
                      <option value={-1}>Error cargando los clientes</option>

                  }
                </select>
              </div>
            </div>
            {/* select con metodo de pago */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="paymentMethodDDL" className="block text-sm/6 font-medium text-gray-900">Metodo de pago</label>
              </div>
              <div className="mt-2">
                <select name="paymentMethodDDL" id="paymentMethodDDL" value={paymentMethod.id} onChange={onInputChangeSale} className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'>
                  <option value={0}>Seleccione un metodo de pago</option>
                  <option value={1}>Efectivo</option>
                  <option value={2}>Credito</option>
                  <option value={3}>Debito</option>
                  <option value={4}>Transferencia</option>

                </select>
              </div>
            </div>
            {/* select con local e input que indica ID de la caja en la que se hara la venta (o si no hay caja abierta) */}
            <div className="flex gap-4">
              <div className="flex flex-col w-1/2">
                <label htmlFor="storesDDL" className="block text-sm font-medium text-gray-900">Local</label>
                <select name="storesDDL" id="storesDDL" value={storeID} onChange={onInputChangeStoreID} className="mt-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm">
                  <option value={0}>Seleccione un local</option>
                  {Array.isArray(storesDDL) ? (
                    storesDDL.map((store, index) => (
                      <option key={index} value={store.id}>
                        {store.name}
                      </option>
                    ))
                  ) : (
                    <option value={-1}>Error cargando los locales</option>
                  )}
                </select>
              </div>
              <div className="flex flex-col w-1/2">
                <label htmlFor="cashRegisterId" className="block text-sm font-medium text-gray-900">ID de la caja abierta</label>
                <input type="text" name="cashRegisterId" id="cashRegisterId" value={cashRegisterId || "No hay cajas abiertas"} readOnly className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled" />
              </div>
            </div>
            {/* select con productos e input con cantidad/peso */}
            <div className="flex gap-4">
              <div className="flex flex-col w-1/2">
                <label htmlFor="productDDL" className="block text-sm font-medium text-gray-900">Producto</label>
                <select name="productDDL" id="productDDL" value={productCode} onChange={onInputChangeProductCode} className="mt-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm">
                  <option value={0}>N/A</option>
                  {
                    Array.isArray(productsDDL)
                      ?
                      productsDDL.map((product, index) => (
                        <option key={index} value={product.productCode}>{product.name}</option>
                      ))
                      :
                      <option value={-1}>Error cargando los productos</option>

                  }
                </select>
              </div>
              <div className="flex flex-col w-1/2">
                <label htmlFor="productAmount" className="block text-sm font-medium text-gray-900">Cantidad / Peso {"(KG)"}</label>
                <input type="number" name="productAmount" id="productAmount" value={productAmount} onChange={onInputChangeProductAmount} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 " />
              </div>
            </div>
            {/* boton agregar producto */}
            <div className='flex justify-center'>
              <button type='button' onClick={handleAddDetail} className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-400 to-orange-600 group-hover:from-green-400 group-hover:to-cyan-600 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                <span className="relative w-full px-5 py-4 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                  Agregar producto
                </span>
              </button>
            </div>
            {/* Input con Total  */}
            <div>
              <label htmlFor="saleTotal" className="flex py-1 text-sm font-medium text-gray-900">Total</label>
              <p name="saleTotal" id="saleTotal" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 " >{saleTotal?.toLocaleString("es-AR") + " $"}</p>
            </div>
            {/* select con estado de la venta */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="saleStatusSelect" className="block text-sm/6 font-medium text-gray-900">Estado de la venta</label>
              </div>
              <div className="mt-2">
                <select name="saleStatusSelect" id="saleStatusSelect" value={saleStatus} onChange={onSelectionSaleStatus} className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'>
                  <option value={""}>Seleccione el estado de la venta</option>
                  <option value={"billed"}>Paga</option>
                  <option value={"pending"}>Pendiente de pago</option>
                </select>
              </div>
            </div>
            {/* Botones Venta y Cancelar */}
            <div className="flex gap-2 m-10">
              <button type='submit' className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-cyan-600 group-hover:from-green-400 group-hover:to-cyan-600 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                  Crear venta
                </span>
              </button>
              <Link to={'/admin/ventas'} className="w-1/2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-yellow-500 to-orange-500 group-hover:from-yellow-500 group-hover:to-orange-500 hover:text-white dark:text-black focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                <span className="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-200 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-center">
                  Cancelar
                </span>
              </Link>
            </div>
          </form>

        </div>
        {/*columma derecha*/}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div>
            <h2 className="font-bold mb-2">Productos agregados</h2>
            {sale.details.length === 0 ? (
              <p>No hay productos aún</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {/* MAP para productos */}
                {sale.details.map((d, index) => (
                  <div key={index} className="border rounded p-2 text-center bg-gray-100">
                    <p className="font-semibold">{d.product.name}</p>
                    <p>Cantidad: {d.amount}</p>
                    <p>Precio: {(d.product.price * d.amount)?.toLocaleString("es-AR") + " $"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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

export default NewSale
