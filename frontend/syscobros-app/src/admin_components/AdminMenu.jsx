import { Link } from 'react-router-dom';
import '../index.css';


export default function Menu() {
  return (
    <div className="max-w-8xl mx-auto px-5 bg-white shadow-lg pt-1 pb-10 rounded-x1">
      <div className="my-8 text-center mb-10">
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800" >Panel del Administrador</h2>
      </div>

      <div className="admin-menu-container">
        <Link className="admin-menu-link" to="/admin/usuarios">
          Usuarios
        </Link>
        <Link className="admin-menu-link" to="/admin/productos">
          Productos
        </Link>
      </div>
      <div className="admin-menu-container">
        <Link className="admin-menu-link" to="/admin/locales">
          Locales
        </Link>
        <Link className="admin-menu-link" to="/admin/proveedores">
          Proveedores
        </Link>
      </div>
      <div className="admin-menu-container">
        <Link className="admin-menu-link" to="/admin/clientes">
          Clientes
        </Link>

        <Link className="admin-menu-link" to="/admin/ventas">
          Ventas
        </Link>
      </div>
      <div className="grid grid-cols-1">
        <Link className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-3 rounded w-123 text-center mx-auto transition duration-200 ease-in-out transform hover:scale-105" to="/admin/cajas">
          Cajas
        </Link>
      </div>
    </div>

  );
}
