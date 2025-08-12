import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/leaves");
      setLeaves(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const approve = async (id) => {
    await api.put(`/leaves/approve/${id}`);
    fetch();
  };

  const reject = async (id) => {
    await api.put(`/leaves/reject/${id}`);
    fetch();
  };

  return (
    <div className="bg-[#202123] min-h-screen p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">All Leave Requests</h2>

      {loading && <div className="text-gray-400">Loading...</div>}

      <div className="space-y-4">
        {leaves.map((l) => (
          <div
            key={l._id}
            className="bg-[#2b2c2f] p-4 rounded-xl shadow flex justify-between items-center hover:bg-[#323336] transition-all duration-200"
          >
            <div>
              <div className="font-medium text-lg">
                {l.user?.name} — {l.leaveType}
              </div>
              <div className="text-sm text-gray-400">
                {new Date(l.startDate).toLocaleDateString()} to{" "}
                {new Date(l.endDate).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded bg-gray-700 text-sm">
                {l.status}
              </div>

              {l.status === "Pending" && (
                <>
                  <button
                    onClick={() => approve(l._id)}
                    className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 hover:opacity-90 transition-all cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(l._id)}
                    className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 hover:opacity-90 transition-all cursor-pointer"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
