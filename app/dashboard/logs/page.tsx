"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  // const projectId = "ccmopnny4x0000nsu4498t027f";
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  useEffect(() => {
    if (projectId) {
      fetchLogs();
    }
  }, [projectId]);
  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/logs?projectId=${projectId}`);

      // Read as text first to avoid JSON parse errors on empty/non-JSON responses
      const text = await res.text();
      let payload: any = null;
      try {
        payload = text ? JSON.parse(text) : null;
      } catch (e) {
        payload = text;
      }

      if (!res.ok) {
        console.error("API error:", payload);
        setLogs([]);
        return;
      }

      console.log("Fetched logs:", payload);

      setLogs(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error("Fetch failed:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Logs</h1>

      {loading ? (
        <p>Loading logs...</p>
      ) : logs.length === 0 ? (
        <div className="bg-white p-6 border rounded">No logs found</div>
      ) : (
        <div className="bg-white border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Project</th>
                <th className="p-3">Endpoint</th>
                <th className="p-3">Status</th>
                <th className="p-3">Time</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{log.projectId}</td>
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
