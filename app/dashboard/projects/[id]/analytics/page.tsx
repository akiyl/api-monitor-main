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

  if (!data) return <p>Loading analytics...</p>;

  // Transform data for charts
  const timeData = Object.entries(data.requestsOverTime).map(
    ([time, count]) => ({
      time,
      count,
    }),
  );

  const statusData = Object.entries(data.statusCounts).map(
    ([status, count]) => ({
      status,
      count,
    }),
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-black mb-6">Analytics</h1>

      {/* 🔥 Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 border rounded">
          <p className="text-sm text-gray-500">Total Requests</p>
          <p className="text-xl font-bold">{data.totalRequests}</p>
        </div>

        <div className="bg-white p-4 border rounded">
          <p className="text-sm text-gray-500">Error Rate</p>
          <p className="text-xl font-bold text-red-600">{data.errorRate}%</p>
        </div>

        <div className="bg-white p-4 border rounded">
          <p className="text-sm text-gray-500">Avg Response</p>
          <p className="text-xl font-bold">{data.avgResponseTime} ms</p>
        </div>
      </div>

      {/* 📈 Requests Over Time */}
      <div className="bg-white p-4 border rounded mb-6">
        <h2 className="mb-4 font-semibold">Requests Over Time</h2>

        <LineChart width={600} height={300} data={timeData}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" />
        </LineChart>
      </div>

      {/* 📊 Status Distribution */}
      <div className="bg-white p-4 border rounded">
        <h2 className="mb-4 font-semibold">Status Codes</h2>

        <BarChart width={600} height={300} data={statusData}>
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </div>
    </div>
  );
}
