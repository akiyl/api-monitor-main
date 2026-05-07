export default function Navbar() {
  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="font-semibold text-black text-lg">Dashboard</h2>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">akshat</span>
        <div className="w-8 h-8 bg-black rounded-full" />
      </div>
    </div>
  );
}
