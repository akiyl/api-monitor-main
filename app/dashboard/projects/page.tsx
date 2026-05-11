"use client";

import { useState } from "react";

export default function CreateProjectPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API error:", data);
        setError(data.error || "Something went wrong");
        setProject(null);
        return;
      }

      setProject(data);
      setName("");
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#E9E6F2] mb-6">Create Project</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-[#8B8699]/20 bg-[#1C1829] text-[#E9E6F2] p-3 w-full rounded-[10px] placeholder:text-[#8B8699]/60 outline-none focus:border-[#A78BFA] transition"
        />

        <button
          type="submit"
          className="bg-[#A78BFA] text-[#13111C] px-5 py-2 rounded-[10px] text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-400">{error}</p>
      )}

      {project && (
        <div className="mt-6 bg-[#1C1829] border border-[#8B8699]/20 rounded-[14px] p-6 max-w-md">
          <h2 className="font-semibold text-[#E9E6F2] mb-3">Project Created</h2>
          <p className="text-sm text-[#8B8699] mb-1">
            <span className="text-[#E9E6F2]">Name:</span> {project.name}
          </p>
          <p className="font-mono text-sm bg-[#13111C] p-3 rounded-[6px] text-[#E9E6F2] break-all mt-2">
            {project.apiKey}
          </p>
          <button
            onClick={() => navigator.clipboard.writeText(project.apiKey)}
            className="mt-3 text-sm text-[#A78BFA] font-medium hover:underline transition"
          >
            Copy API Key
          </button>
        </div>
      )}
    </div>
  );
}
