import { useState } from "react";
import { Link } from "react-router-dom";


function Navbar({ role }) {
  if (!role) {
    return (
      <nav className="bg-gray-800 text-white px-4 py-3 h-16 flex justify-between items-center">
        <div className="navbar-text translate-y-[1px]">Sistema de cobros</div>
      </nav>
    );
  }

  if (role === 'ADMINISTRADOR') {
    return (
      <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
        <div className="navbar-text">Sistema de Cobros - Panel Administrador</div>
        <div className="flex space-x-4">
          <div className="relative group">
            <button className="navbar-cell">Productos</button>
            <div className="navbar-cell-list">
              <Link to="/admin/productos" className="navbar-cell-list-link">Listar</Link>
              <Link to="/admin/productos/agregar" className="navbar-cell-list-link">Agregar</Link>
              <Link to="/admin/productos/eliminar" className="navbar-cell-list-link">Eliminar</Link>
            </div>
          </div>

          <div className="relative group">
            <button className="navbar-cell">Proveedores</button>
            <div className="navbar-cell-list">
              <Link to="admin/proveedores" className="navbar-cell-list-link">Listado</Link>
              <Link to="admin/proveedores/agregar" className="navbar-cell-list-link">Agregar</Link>
              <Link to="admin/proveedores/eliminar" className="navbar-cell-list-link">Eliminar</Link>

            </div>
          </div>

          <div className="relative group">
            <button className="navbar-cell">Locales</button>
            <div className="navbar-cell-list">
              <Link to="admin/locales" className="navbar-cell-list-link">Listado</Link>
              <Link to="admin/locales/agregar" className="navbar-cell-list-link">Agregar</Link>
              <Link to="admin/locales/eliminar" className="navbar-cell-list-link">Eliminar</Link>

            </div>
          </div>
          <div className="relative group">
            <button className="navbar-cell">Usuarios</button>
            <div className="navbar-cell-list">
              <Link to="admin/usuarios" className="navbar-cell-list-link">Listado</Link>
              <Link to="admin/usuarios/agregar" className="navbar-cell-list-link">Agregar</Link>
              <Link to="admin/usuarios/eliminar" className="navbar-cell-list-link">Eliminar</Link>

            </div>
          </div>
          <div className="relative group">
            <button className="navbar-cell">Clientes</button>
            <div className="navbar-cell-list">
              <Link to="admin/clientes" className="navbar-cell-list-link">Listado</Link>
              <Link to="admin/clientes/agregar" className="navbar-cell-list-link">Agregar</Link>
              <Link to="admin/clientes/eliminar" className="navbar-cell-list-link">Eliminar</Link>

            </div>
          </div>
          <div className="relative group">
            <button className="navbar-cell">Ventas</button>
            <div className="navbar-cell-list">
              <Link to="admin/ventas" className="navbar-cell-list-link">Ventas</Link>
              <Link to="admin/ventas/nueva" className="navbar-cell-list-link">Nueva venta</Link>
            </div>
          </div>
          <div className="relative group">
            <button className="navbar-cell">Cajas</button>
            <div className="navbar-cell-list">
              <Link to="admin/cajas" className="navbar-cell-list-link">Listado</Link>
              <Link to="admin/cajas/abrir" className="navbar-cell-list-link">Abrir caja</Link>
              <Link to="admin/cajas/movimientos/nuevo" className="navbar-cell-list-link">Nuevo movimiento</Link>
            </div>
          </div>
          <div className="relative group">
            <Link to="/login" className=" pr-4 hover:text-red-500 text-sm">Cerrar Sesión</Link>
          </div>
        </div>
      </nav>
    );
  }

  if (role === 'vendedor') {
    return (
      <nav className="bg-green-800 text-white px-4 py-3 flex justify-between">
        <div className="navbar-text">Vendedor</div>
        <div className="space-x-4">
          <Link to="/ventas" className="hover:underline">Ventas</Link>
          <Link to="/clientes" className="hover:underline">Clientes</Link>
          <Link to="/logout" className="hover:underline">Salir</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-purple-800 text-white px-4 py-3 flex justify-between">
      <div className="navbar-text">Cliente</div>
      <div className="space-x-4">
        <Link to="/perfil" className="hover:underline">Mi perfil</Link>
        <Link to="/logout" className="hover:underline">Salir</Link>
      </div>
    </nav>
  );
}

export default Navbar;
