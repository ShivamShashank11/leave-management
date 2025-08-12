import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthContext } from "./context/AuthContext";

function RequireAuth({ children, roles }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={<h2 className="text-xl">Welcome — Login or Register</h2>}
        />
        <Route
          path="/employee"
          element={
            <RequireAuth roles={["Employee"]}>
              <EmployeeDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth roles={["Admin", "HR"]}>
              <AdminDashboard />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
}
