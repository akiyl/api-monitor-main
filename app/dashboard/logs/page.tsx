"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (projectId) {
      fetchLogs();
    }
  }, [projectId]);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/logs?projectId=${projectId}`);

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
      <h1 className="text-2xl font-bold text-[#E9E6F2] mb-6">Logs</h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#A78BFA] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-[#1C1829] border border-[#8B8699]/20 rounded-[14px] p-8 text-center text-[#8B8699]">
          No logs found
        </div>
      ) : (
        <div className="bg-[#1C1829] border border-[#8B8699]/20 rounded-[14px] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#8B8699]/20">
                <th className="p-3 text-left text-[10px] font-mono tracking-[0.04em] text-[#8B8699] uppercase">
                  Project
                </th>
                <th className="p-3 text-left text-[10px] font-mono tracking-[0.04em] text-[#8B8699] uppercase">
                  Endpoint
                </th>
                <th className="p-3 text-left text-[10px] font-mono tracking-[0.04em] text-[#8B8699] uppercase">
                  Status
                </th>
                <th className="p-3 text-left text-[10px] font-mono tracking-[0.04em] text-[#8B8699] uppercase">
                  Time
                </th>
                <th className="p-3 text-left text-[10px] font-mono tracking-[0.04em] text-[#8B8699] uppercase">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-[#8B8699]/5 hover:bg-[#13111C]/50 transition"
                >
                  <td className="p-3 text-sm text-[#8B8699]">
                    {log.projectId}
                  </td>
                  <td className="p-3 font-mono text-sm text-[#E9E6F2]">
                    {log.endpoint}
                  </td>
                  <td className="p-3">
                    <span
                      className={`font-mono text-xs px-2 py-0.5 rounded-[6px] ${
                        log.status >= 500
                          ? "bg-red-900/40 text-red-400"
                          : log.status >= 400
                            ? "bg-yellow-900/40 text-yellow-400"
                            : "bg-green-900/40 text-green-400"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`font-mono text-sm ${
                        log.responseTime > 1000
                          ? "text-red-400"
                          : "text-[#E9E6F2]"
                      }`}
                    >
                      {log.responseTime}ms
                    </span>
                  </td>
                  <td className="p-3 text-sm text-[#8B8699]">
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
