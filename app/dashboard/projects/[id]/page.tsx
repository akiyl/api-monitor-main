"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProjectLogsPage() {
  const params = useParams();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchProject();
    fetchLogs();
  }, []);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.apiKey) setApiKey(data.apiKey);
      }
    } catch (err) {
      console.error("Failed to fetch project:", err);
    }
  };

  const sendTestLog = async () => {
    if (!apiKey) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          endpoint: "/api/test",
          method: "POST",
          status: 200,
          responseTime: Math.floor(Math.random() * 500) + 50,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSendResult("success");
        fetchLogs();
      } else {
        setSendResult(`error: ${data.error}`);
      }
    } catch (err) {
      setSendResult(`error: ${err instanceof Error ? err.message : "Request failed"}`);
    } finally {
      setSending(false);
    }
  };

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
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-[#E9E6F2]">Logs</h1>
        <div className="flex items-center gap-3">
          {apiKey && (
            <>
              <div className="text-[10px] font-mono tracking-[0.04em] text-[#8B8699] bg-[#1C1829] px-3 py-1.5 rounded-[6px]">
                KEY: {apiKey.slice(0, 16)}...
              </div>
              <button
                onClick={sendTestLog}
                disabled={sending}
                className="bg-[#A78BFA] text-[#13111C] px-4 py-2 rounded-[10px] text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
              >
                {sending ? "Sending..." : "Send Test Log"}
              </button>
            </>
          )}
          {sendResult === "success" && (
            <span className="text-xs font-mono text-green-400">sent</span>
          )}
          {sendResult && sendResult !== "success" && (
            <span className="text-xs font-mono text-red-400">{sendResult}</span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {["all", "errors", "slow"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-[10px] text-xs font-mono tracking-[0.04em] transition ${
              filter === f
                ? "bg-[#A78BFA] text-[#13111C]"
                : "bg-[#1C1829] text-[#8B8699] border border-[#8B8699]/20 hover:text-[#E9E6F2]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#A78BFA] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="bg-[#1C1829] border border-[#8B8699]/20 rounded-[14px] p-8 text-center text-[#8B8699]">
          No logs found
        </div>
      ) : (
        <div className="bg-[#1C1829] border border-[#8B8699]/20 rounded-[14px] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#8B8699]/20">
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
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-[#8B8699]/5 hover:bg-[#13111C]/50 transition"
                >
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
