import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { register } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
  });
  const [err, setErr] = useState(null);
  const [showRoles, setShowRoles] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await register(form);
      nav("/login");
    } catch (err) {
      setErr(err?.response?.data?.message || err.message);
    }
  };

  const roles = ["Employee", "Admin", "HR"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#212121] px-4 pt-16">
      <div className="bg-[#2b2b2b] p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
          Create Account
        </h2>
        <form onSubmit={submit} className="space-y-5">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handle}
            className="w-full p-3 border border-gray-600 bg-[#1e1e1e] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm transition"
            required
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handle}
            className="w-full p-3 border border-gray-600 bg-[#1e1e1e] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm transition"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handle}
            className="w-full p-3 border border-gray-600 bg-[#1e1e1e] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm transition"
            required
          />

          <div className="relative">
            <div
              onClick={() => setShowRoles(!showRoles)}
              className="w-full p-3 border border-gray-600 bg-[#1e1e1e] text-white rounded-lg cursor-pointer focus:outline-none shadow-sm transition"
            >
              {form.role}
            </div>
            {showRoles && (
              <div className="absolute w-full mt-1 bg-[#1e1e1e] border border-gray-600 rounded-lg shadow-lg z-10">
                {roles.map((role) => (
                  <div
                    key={role}
                    onClick={() => {
                      setForm({ ...form, role });
                      setShowRoles(false);
                    }}
                    className="p-3 text-white hover:bg-gradient-to-r hover:from-orange-500 hover:via-red-500 hover:to-yellow-500 hover:text-black transition cursor-pointer rounded-md"
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 text-white p-3 rounded-lg font-semibold shadow-lg 
              transform transition duration-300 ease-in-out 
              hover:scale-105 hover:brightness-110 
              cursor-pointer"
          >
            Register
          </button>
          {err && (
            <div className="text-red-400 mt-2 text-center text-sm font-medium">
              {err}
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-400 text-sm">
            Already have an account?{" "}
          </span>
          <Link
            to="/login"
            className="text-yellow-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
