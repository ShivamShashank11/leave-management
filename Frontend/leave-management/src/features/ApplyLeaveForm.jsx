import React, { useState } from "react";
import api from "../api/axios";

export default function ApplyLeaveForm({ onDone }) {
  const [form, setForm] = useState({
    leaveType: "Sick",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await api.post("/leaves", form);
      setMsg({ type: "success", text: res.data.message || "Applied" });
      setForm({ leaveType: "Sick", startDate: "", endDate: "", reason: "" });
      onDone && onDone();
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-[#2b2b2b] border border-gray-700 p-6 rounded-xl shadow-lg text-white w-full max-w-lg"
    >
      <h3 className="font-bold text-2xl mb-5 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
        Apply for Leave
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <select
          name="leaveType"
          value={form.leaveType}
          onChange={handle}
          className="bg-[#3a3a3a] border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-white"
        >
          <option>Sick</option>
          <option>Casual</option>
          <option>Paid</option>
          <option>Unpaid</option>
        </select>

        <input
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={handle}
          className="bg-[#3a3a3a] border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-white"
          required
        />
        <input
          name="endDate"
          type="date"
          value={form.endDate}
          onChange={handle}
          className="bg-[#3a3a3a] border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-white"
          required
        />

        <input
          name="reason"
          placeholder="Reason"
          value={form.reason}
          onChange={handle}
          className="bg-[#3a3a3a] border border-gray-600 p-3 rounded-lg col-span-2 focus:outline-none focus:ring-2 focus:ring-orange-400 text-white"
          required
        />
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <button
          className="px-6 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 hover:from-yellow-500 hover:via-red-500 hover:to-orange-500 transition-all duration-300 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Applying..." : "Apply"}
        </button>

        {msg && (
          <div
            className={`text-sm ${
              msg.type === "error" ? "text-red-400" : "text-green-400"
            }`}
          >
            {msg.text}
          </div>
        )}
      </div>
    </form>
  );
}
