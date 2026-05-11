"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsPage() {
  const { id } = useParams();

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const res = await fetch(`/api/analytics?projectId=${id}`);
    const json = await res.json();
    setData(json);
  };

  if (!data)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#A78BFA] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const timeData = Object.entries(data.requestsOverTime).map(
    ([time, count]) => ({ time, count }),
  );

  const statusData = Object.entries(data.statusCounts).map(
    ([status, count]) => ({ status, count }),
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#E9E6F2] mb-6">Analytics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1C1829] border border-[#8B8699]/20 rounded-[14px] p-6">
          <p className="text-[10px] font-mono tracking-[0.04em] text-[#8B8699] uppercase">
            Total Requests
          </p>
          <p className="text-2xl font-bold text-[#E9E6F2] mt-1">
            {data.totalRequests}
          </p>
        </div>

        <div className="bg-[#1C1829] border border-[#8B8699]/20 rounded-[14px] p-6">
          <p className="text-[10px] font-mono tracking-[0.04em] text-[#8B8699] uppercase">
            Error Rate
          </p>
          <p className="text-2xl font-bold text-red-400 mt-1">
            {data.errorRate}%
          </p>
        </div>

        <div className="bg-[#1C1829] border border-[#8B8699]/20 rounded-[14px] p-6">
          <p className="text-[10px] font-mono tracking-[0.04em] text-[#8B8699] uppercase">
            Avg Response
          </p>
          <p className="text-2xl font-bold text-[#E9E6F2] mt-1">
            {data.avgResponseTime} ms
          </p>
        </div>
      </div>

      {/* Requests Over Time */}
      <div className="bg-[#1C1829] border border-[#8B8699]/20 rounded-[14px] p-6 mb-6">
        <h2 className="text-sm font-semibold text-[#E9E6F2] mb-4">
          Requests Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeData}>
            <XAxis
              dataKey="time"
              stroke="#8B8699"
              tick={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
            />
            <YAxis
              stroke="#8B8699"
              tick={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
            />
            <Tooltip
              contentStyle={{
                background: "#1C1829",
                border: "1px solid #8B8699",
                borderRadius: "10px",
                color: "#E9E6F2",
                fontSize: 12,
                fontFamily: "JetBrains Mono, monospace",
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#A78BFA"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Status Distribution */}
      <div className="bg-[#1C1829] border border-[#8B8699]/20 rounded-[14px] p-6">
        <h2 className="text-sm font-semibold text-[#E9E6F2] mb-4">
          Status Codes
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <XAxis
              dataKey="status"
              stroke="#8B8699"
              tick={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
            />
            <YAxis
              stroke="#8B8699"
              tick={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
            />
            <Tooltip
              contentStyle={{
                background: "#1C1829",
                border: "1px solid #8B8699",
                borderRadius: "10px",
                color: "#E9E6F2",
                fontSize: 12,
                fontFamily: "JetBrains Mono, monospace",
              }}
            />
            <Bar dataKey="count" fill="#A78BFA" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
