import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminMenu from '../admin_components/AdminMenu';
import NotFoundPage from '../shared/NotFoundPage';
import SystemUsers from '../admin_components/system_users/SystemUsers'
import UpdatePassword from '../admin_components/system_users/UpdatePassword';
import EditUser from '../admin_components/system_users/EditUser';
import AddUser from '../admin_components/system_users/AddUser';
import DeleteUser from '../admin_components/system_users/DeleteUser';
import Stores from '../admin_components/stores/Stores';
import AddStore from '../admin_components/stores/AddStore';
import DeleteStore from '../admin_components/stores/DeleteStore';
import EditStore from '../admin_components/stores/EditStore';
import Clients from '../admin_components/clients/Clients';
import EditClient from '../admin_components/clients/EditClient';
import AddClient from '../admin_components/clients/AddClient';
import DeleteClient from '../admin_components/clients/DeleteClient';
import Suppliers from '../admin_components/suppliers/Suppliers';
import EditSupplier from '../admin_components/suppliers/EditSupplier';
import DeleteSupplier from '../admin_components/suppliers/DeleteSupplier';
import AddSupplier from '../admin_components/suppliers/AddSupplier';
import Products from '../admin_components/products/Products';
import EditProduct from '../admin_components/products/EditProduct';
import DeleteProduct from '../admin_components/products/DeleteProduct';
import AddProduct from '../admin_components/products/AddProduct';
import CashRegisters from '../admin_components/cash_registers/CashRegisters';
import OpenCashRegister from '../admin_components/cash_registers/OpenCashRegister';
import CloseCashRegister from '../admin_components/cash_registers/CloseCashRegister';
import AuditCashRegister from '../admin_components/cash_registers/AuditCashRegister';
import Sales from '../admin_components/sales/Sales';
import NewSaleAdmin from '../admin_components/sales/NewSaleAdmin';
import SaleDetail from '../admin_components/sales/SaleDetail';
import CashMovements from '../admin_components/cash_registers/CashMovements'
import DoCashMovement from '../admin_components/cash_registers/DoCashMovement';


export default function AdminRoutes() {
    if (localStorage.getItem('role') != 'ADMINISTRADOR') {
        localStorage.setItem('jwtToken', '');
        localStorage.setItem('role', '');
        return <Navigate to='/login' replace />;
    }
    return (
        <Routes>
            <Route path="*" element={<NotFoundPage />} />
            <Route path='menu' element={<AdminMenu />} />

            <Route path='usuarios' element={<SystemUsers />} />
            <Route path='usuarios/updatePassword/:idUser' element={<UpdatePassword />} />
            <Route path='usuarios/edit/:idUser' element={<EditUser />} />
            <Route path='usuarios/agregar' element={<AddUser />} />
            <Route path='usuarios/eliminar' element={<DeleteUser />} />

            <Route path='locales' element={<Stores />} />
            <Route path='locales/edit/:idStore' element={<EditStore />} />
            <Route path='locales/agregar' element={<AddStore />} />
            <Route path='locales/eliminar' element={<DeleteStore />} />

            <Route path='clientes' element={<Clients />} />
            <Route path='clientes/edit/:idClient' element={<EditClient />} />
            <Route path='clientes/agregar' element={<AddClient />} />
            <Route path='clientes/eliminar' element={<DeleteClient />} />

            <Route path='proveedores' element={<Suppliers />} />
            <Route path='proveedores/edit/:idSupplier' element={<EditSupplier />} />
            <Route path='proveedores/agregar' element={<AddSupplier />} />
            <Route path='proveedores/eliminar' element={<DeleteSupplier />} />

            <Route path='productos' element={<Products />} />
            <Route path='productos/edit/:productCode' element={<EditProduct />} />
            <Route path='productos/agregar' element={<AddProduct />} />
            <Route path='productos/eliminar' element={<DeleteProduct />} />

            <Route path='cajas' element={<CashRegisters />} />
            <Route path='cajas/abrir' element={<OpenCashRegister />} />
            <Route path='cajas/cerrar/:cashRegisterID' element={<CloseCashRegister />} />
            <Route path='cajas/auditar/:cashRegisterID' element={<AuditCashRegister />} />
            <Route path='cajas/:cashRegisterID/movimientos' element={<CashMovements />} />
            <Route path='cajas/movimientos/nuevo' element={<DoCashMovement />} />

            <Route path='ventas' element={<Sales />} />
            <Route path='ventas/nueva' element={<NewSaleAdmin />} />
            <Route path='ventas/detalle/:saleID' element={<SaleDetail />} />








        </Routes>
    )
}
