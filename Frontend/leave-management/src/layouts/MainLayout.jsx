import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="bg-[#202123] min-h-screen text-white">
      <Navbar />
      <main className="pt-16 max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
