export default function Navbar() {
  return (
    <div className="h-16 bg-[#1C1829] border-b border-[#8B8699]/20 flex items-center justify-between px-6">
      <h2 className="font-semibold text-[#E9E6F2] text-lg">Dashboard</h2>

      <div className="flex items-center gap-3">
        <span className="text-sm text-[#8B8699]">akshat</span>
        <div className="w-8 h-8 rounded-[10px] bg-[#A78BFA] flex items-center justify-center text-[#13111C] text-xs font-semibold">
          A
        </div>
      </div>
    </div>
  );
}
