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
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Create Project</h1>

      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full text-black"
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>

      {/* Show API Key after creation */}
      {project && (
        <div className="mt-6 p-4 border">
          <h2 className="font-semibold">Project Created 🎉</h2>
          <p className="">
            <strong>Name:</strong> {project.name}
          </p>
          <p>
            <strong>API Key:</strong> {project.apiKey}
          </p>
        </div>
      )}
      {project ? (
        <>
          <p className="font-mono bg-gray-100 p-2 rounded">{project.apiKey}</p>

          <button
            onClick={() => navigator.clipboard.writeText(project.apiKey)}
            className="mt-2 text-sm text-blue-600"
          >
            Copy API Key
          </button>
        </>
      ) : null}
    </div>
  );
}
