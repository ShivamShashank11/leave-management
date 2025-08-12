import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const doLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between h-14">
        <Link
          to="/"
          className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400"
        >
          Leave Management
        </Link>

        <div className="flex items-center gap-4">
          {!user && (
            <>
              <Link
                to="/login"
                className="text-sm font-medium px-3 py-1 rounded bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 text-white transition-transform transform hover:scale-105"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-3 py-1 rounded bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 text-white transition-transform transform hover:scale-105"
              >
                Register
              </Link>
            </>
          )}

          {user?.role === "Employee" && (
            <Link
              to="/employee"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Employee
            </Link>
          )}

          {(user?.role === "Admin" || user?.role === "HR") && (
            <Link
              to="/admin"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Admin
            </Link>
          )}

          {user && (
            <button
              onClick={doLogout}
              className="ml-2 px-3 py-1 rounded bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 text-white transition-transform transform hover:scale-105"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
