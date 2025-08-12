import React, { useEffect, useState } from "react";
import ApplyLeaveForm from "../features/ApplyLeaveForm";
import api from "../api/axios";

export default function EmployeeDashboard() {
  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/leaves/my");
      setUser(res.data.user);
      setLeaves(res.data.leaves || []);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const cancelLeave = async (id) => {
    if (!confirm("Cancel this leave?")) return;
    await api.put(`/leaves/cancel/${id}`);
    fetch();
  };

  return (
    <div className="min-h-screen bg-[#202123] text-white p-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">My Leaves</h2>
        {loading && <div className="text-gray-400">Loading...</div>}
        {error && <div className="text-red-400">{error}</div>}

        <div className="space-y-3">
          {leaves.map((l) => (
            <div
              key={l._id}
              className="bg-[#2d2f32] p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <div className="font-medium text-lg">
                  {l.leaveType} — {new Date(l.startDate).toLocaleDateString()}{" "}
                  to {new Date(l.endDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-400">{l.reason}</div>
              </div>
              <div className="text-right">
                <div
                  className={`mb-2 font-semibold ${
                    l.status === "Pending"
                      ? "text-yellow-400"
                      : l.status === "Approved"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {l.status}
                </div>
                {l.status === "Pending" && (
                  <button
                    onClick={() => cancelLeave(l._id)}
                    className="text-sm text-white px-3 py-1 rounded transition bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 hover:from-red-600 hover:via-orange-600 hover:to-yellow-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="bg-[#2d2f32] p-6 rounded-lg shadow space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Profile</h3>
          {user && (
            <div>
              <div className="text-xl font-medium">{user.name}</div>
              <div className="text-sm text-gray-400">
                Balance: {user.leaveBalance}
              </div>
            </div>
          )}
        </div>

        <div>
          <ApplyLeaveForm onDone={fetch} />
        </div>
      </aside>
    </div>
  );
}
