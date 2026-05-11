"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

      setProjects((prev) => [data, ...prev]);
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
        <h1 className="text-2xl font-bold text-[#E9E6F2]">Projects</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#A78BFA] text-[#13111C] px-5 py-2 rounded-[10px] text-sm font-semibold hover:opacity-90 transition"
        >
          + New Project
        </button>
      </div>

      {/* Create Project Form */}
      {showForm && (
        <div className="mb-6 bg-[#1C1829] p-6 rounded-[14px] border border-[#8B8699]/20">
          <input
            type="text"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="border border-[#8B8699]/20 bg-[#13111C] text-[#E9E6F2] p-3 w-full mb-3 rounded-[10px] placeholder:text-[#8B8699]/60 outline-none focus:border-[#A78BFA] transition"
          />

          <div className="flex gap-2">
            <button
              onClick={createProject}
              disabled={creating}
              className="bg-[#A78BFA] text-[#13111C] px-5 py-2 rounded-[10px] text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
            >
              {creating ? "Creating..." : "Create"}
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="border border-[#8B8699]/20 text-[#8B8699] px-5 py-2 rounded-[10px] text-sm hover:text-[#E9E6F2] transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#A78BFA] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#1C1829] border border-[#8B8699]/20 rounded-[14px] p-8 text-center">
          <p className="text-[#8B8699]">No projects yet. Create your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#1C1829] p-6 rounded-[14px] border border-[#8B8699]/20 hover:border-[#8B8699]/40 transition"
            >
              <h2 className="font-semibold text-lg text-[#E9E6F2]">
                {project.name}
              </h2>

              <p className="text-sm text-[#8B8699] mt-2">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-4">
                <p className="text-[10px] font-mono tracking-[0.04em] text-[#8B8699] uppercase">
                  API Key
                </p>
                <p className="font-mono text-sm text-[#E9E6F2] bg-[#13111C] p-2 rounded-[6px] mt-1 truncate">
                  {project.maskedApiKey ??
                    (project.apiKey
                      ? project.apiKey.slice(0, 20) + "..."
                      : "No key")}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <a
                  href={`/dashboard/projects/${project.id}`}
                  className="text-sm text-[#A78BFA] font-medium hover:underline transition"
                >
                  View details →
                </a>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(`/api/projects/${project.id}`);
                      if (!res.ok) return;
                      const data = await res.json();
                      const key = data.apiKey;
                      if (key) {
                        await navigator.clipboard.writeText(key);
                        setCopiedId(project.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }
                    } catch {
                      // silent
                    }
                  }}
                  className="text-sm text-[#8B8699] hover:text-[#A78BFA] transition font-mono tracking-[0.04em]"
                >
                  <span className={copiedId === project.id ? "text-[#A78BFA]" : ""}>
                    {copiedId === project.id ? "copied" : "copy key"}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
