"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // NEW STATE
  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  // (removed stray socket listener that referenced undefined `setLogs`)
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) {
        const text = await res.text();
        console.error("/api/projects fetch failed:", res.status, text);
        setProjects([]);
        return;
      }

      // Try parse JSON, but guard against HTML/error pages
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Expected JSON but got:", text);
        setProjects([]);
        return;
      }

      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 CREATE PROJECT FUNCTION
  const createProject = async () => {
    if (!projectName.trim()) return;

    setCreating(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: projectName }),
      });

      if (!res.ok) {
        const text = await res.text();
        // If the server returned HTML (error page), log it for debugging
        console.error("/api/projects POST failed:", res.status, text);
        throw new Error("Failed to create project");
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Expected JSON but got:", text);
        throw new Error("Invalid server response");
      }

      const data = await res.json();

      // ✅ Add new project to UI instantly
      setProjects((prev) => [data, ...prev]);

      // reset
      setProjectName("");
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Projects</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + New Project
        </button>
      </div>

      {/* 🔥 Create Project Form */}
      {showForm && (
        <div className="mb-6 bg-white text-black p-4 border rounded">
          <input
            type="text"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="border p-2 w-full mb-3"
          />

          <div className="flex gap-2">
            <button
              onClick={createProject}
              disabled={creating}
              className="bg-black text-white px-4 py-2 rounded"
            >
              {creating ? "Creating..." : "Create"}
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <div className="text-gray-900 border p-6 rounded bg-white">
          No projects yet. Create your first one 🚀
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-4 rounded  text-black border hover:shadow transition"
            >
              <h2 className="font-semibold text-lg">{project.name}</h2>

              <p className="text-sm text-gray-500 mt-2">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-4">
                <p className="text-xs text-gray-400">API KEY</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                  {project.maskedApiKey ??
                    (project.apiKey
                      ? project.apiKey.slice(0, 20) + "..."
                      : "No key")}
                </p>
              </div>

              <div className="mt-4 flex justify-between">
                <a
                  href={`/dashboard/projects/${project.id}`}
                  className="text-sm text-blue-600"
                >
                  View →
                </a>

                <button
                  onClick={() => {
                    const toCopy = project.apiKey ?? "";
                    if (toCopy) navigator.clipboard.writeText(toCopy);
                  }}
                  disabled={!project.apiKey}
                  className="text-sm text-gray-600 disabled:opacity-50"
                >
                  Copy Key
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
