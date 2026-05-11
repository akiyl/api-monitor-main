"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/projects", label: "Projects" },
    { href: "/dashboard/logs", label: "Logs" },
  ];

  return (
    <div className="w-64 bg-[#1C1829] text-[#E9E6F2] p-5 flex flex-col border-r border-[#8B8699]/20">
      <Link href="/" className="mb-8">
        <h1 className="text-xl font-bold tracking-tight mb-8">
          <span className="text-[#A78BFA]">Trace</span>Flow
        </h1>
      </Link>

      <nav className="space-y-5 pt-5">
        {links.map((item) => {
          const isActive = item.href !== "#" && pathname.startsWith(item.href);
          return (
            <a
              key={item.label}
              href={item.href}
              className={`block px-3 py-2 rounded-[10px] text-sm transition ${
                isActive
                  ? "bg-[#A78BFA]/10 text-[#A78BFA] font-medium"
                  : "text-[#8B8699] hover:text-[#E9E6F2] hover:bg-[#13111C]"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
