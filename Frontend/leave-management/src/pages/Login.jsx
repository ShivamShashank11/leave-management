import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await login(email, password);
      if (res?.data?.user?.role === "Employee") nav("/employee");
      else nav("/admin");
    } catch (err) {
      setErr(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#212121] px-4 pt-16">
      <div className="bg-[#2b2b2b] p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <form onSubmit={submit} className="space-y-5">
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-600 bg-[#1e1e1e] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm transition"
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-600 bg-[#1e1e1e] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm transition"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 text-white p-3 rounded-lg font-semibold shadow-lg 
              transform transition duration-300 ease-in-out 
              hover:scale-105 hover:brightness-110 
              cursor-pointer"
          >
            Login
          </button>
          {err && (
            <div className="text-red-400 mt-2 text-center text-sm font-medium">
              {err}
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-400 text-sm">Don’t have an account? </span>
          <Link
            to="/register"
            className="text-yellow-400 font-semibold hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
