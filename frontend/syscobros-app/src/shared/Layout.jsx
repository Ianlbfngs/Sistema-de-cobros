import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

export default function Layout({ role }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar role={role} />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="text-center text-gray-500 py-4 text-sm">
        &copy; 2025 Sistema de Cobros. Todos los derechos reservados.
      </footer>
    </div>
  )
}
