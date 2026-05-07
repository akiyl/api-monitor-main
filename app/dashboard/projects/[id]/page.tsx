"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProjectLogsPage() {
  const params = useParams();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, logs]);
  useEffect(() => {
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);
  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/logs?projectId=${projectId}`);

      if (!res.ok) {
        const text = await res.text();
        console.error("/api/logs fetch failed:", res.status, text);
        setLogs([]);
        setLoading(false);
        return;
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Expected JSON but got:", text);
        setLogs([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch logs failed:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (filter === "errors") {
      setFilteredLogs(logs.filter((log) => log.status >= 400));
    } else if (filter === "slow") {
      setFilteredLogs(logs.filter((log) => log.responseTime > 1000));
    } else {
      setFilteredLogs(logs);
    }
  };

  return (
    <div>
      <h1 className="text-2xl text-black font-bold mb-6">Logs</h1>

      {/* 🔥 Filters */}
      <div className="flex gap-2 mb-4">
        {["all", "errors", "slow"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded border ${
              filter === f ? "bg-black text-white" : "bg-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 🔥 Table */}
      {loading ? (
        <p>Loading logs...</p>
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white p-6 border rounded">No logs found</div>
      ) : (
        <div className="bg-white border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Endpoint</th>
                <th className="p-3">Status</th>
                <th className="p-3">Time</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono">{log.endpoint}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        log.status >= 500
                          ? "bg-red-100 text-red-700"
                          : log.status >= 400
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <span
                      className={
                        log.responseTime > 1000
                          ? "text-red-600 font-semibold"
                          : ""
                      }
                    >
                      {log.responseTime} ms
                    </span>
                  </td>

                  <td className="p-3 text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
