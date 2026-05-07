export default function Sidebar() {
  return (
    <div className="w-64 bg-black text-white p-5">
      <h1 className="text-xl font-bold mb-8">TraceFlow</h1>

      <nav className="space-y-4">
        <a href="/dashboard" className="block hover:text-gray-300">
          Dashboard
        </a>
        <a href="/dashboard/projects" className="block hover:text-gray-300">
          Projects
        </a>
        <a href="/dashboard/logs" className="block hover:text-gray-300">
          Logs
        </a>
        <a
          href="/dashboard/projects/[id]/analytics"
          className="block hover:text-gray-300"
        >
          Analytics
        </a>
        <a href="#" className="block hover:text-gray-300">
          Settings
        </a>
      </nav>
    </div>
  );
}
