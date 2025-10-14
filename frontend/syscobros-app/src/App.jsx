import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState, useEffect } from 'react'
import Login from "./shared/Login";
import AdminRoutes from "./routes/AdminRoutes";
import ProtectedRoute from "./manager/ProtectedRoute";
import Layout from "./shared/Layout";
import NotFoundPage from "./shared/NotFoundPage";

function App() {

  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout role={role} />}>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login setRole={setRole} />} />
          <Route path="/admin/*" element={<ProtectedRoute> <AdminRoutes /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
