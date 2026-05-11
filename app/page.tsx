export default function Home() {
  return (
    <div className="min-h-screen bg-[#13111C] text-[#E9E6F2] overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span className="text-xl font-bold tracking-tight">
          <span className="text-[#A78BFA]">Trace</span>Flow
        </span>
        <a
          href="/dashboard"
          className="bg-[#A78BFA] text-[#13111C] px-5 py-2 rounded-[10px] text-sm font-semibold hover:opacity-90 transition"
        >
          Dashboard
        </a>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Monitor your APIs in{" "}
          <span className="text-[#A78BFA]">real-time</span>
        </h1>
        <p className="mt-6 text-lg text-[#8B8699] max-w-2xl mx-auto">
          Track requests, debug errors, and get insights on every API call. TraceFlow gives you
          full visibility into your endpoints.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="/dashboard"
            className="bg-[#A78BFA] text-[#13111C] px-6 py-3 rounded-[10px] font-semibold hover:opacity-90 transition"
          >
            Get Started →
          </a>
          <a
            href="/dashboard"
            className="border border-[#8B8699]/30 text-[#8B8699] px-6 py-3 rounded-[10px] font-semibold hover:text-[#E9E6F2] hover:border-[#8B8699]/60 transition"
          >
            View Dashboard
          </a>
        </div>
      </section>

      {/* Terminal preview card */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-[#1C1829] border border-[#8B8699]/20 rounded-[14px] p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-[10px] font-mono tracking-[0.04em] text-[#8B8699]">dashboard</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm font-mono text-[#E9E6F2]">GET /api/users</span>
              <span className="ml-auto text-[10px] font-mono text-green-400">200 — 12ms</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-sm font-mono text-[#E9E6F2]">POST /api/orders</span>
              <span className="ml-auto text-[10px] font-mono text-yellow-400">201 — 45ms</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-sm font-mono text-[#E9E6F2]">DELETE /api/cache</span>
              <span className="ml-auto text-[10px] font-mono text-red-400">500 — 2300ms</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#8B8699]/20 flex justify-between text-[10px] font-mono tracking-[0.04em] text-[#8B8699]">
            <span>12 requests in last 5 min</span>
            <span>99.2% uptime</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "⚡",
              title: "Real-time monitoring",
              desc: "Watch API requests flow in as they happen. Instant feedback on every call.",
            },
            {
              icon: "🔍",
              title: "Detailed logs",
              desc: "Inspect headers, bodies, status codes, and timing for every request.",
            },
            {
              icon: "🔑",
              title: "API key management",
              desc: "Generate and manage API keys per project. Easy copy & rotate.",
            },
            {
              icon: "📊",
              title: "Usage analytics",
              desc: "Track request volume, error rates, and response times over time.",
            },
            {
              icon: "🔔",
              title: "Instant alerts",
              desc: "Get notified when endpoints go down or error rates spike.",
            },
            {
              icon: "🔗",
              title: "Easy integration",
              desc: "One header, any stack. Plug into any HTTP client in seconds.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-[#1C1829] border border-[#8B8699]/20 rounded-[14px] p-6 hover:border-[#8B8699]/40 transition"
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-3 font-semibold text-lg text-[#E9E6F2]">{f.title}</h3>
              <p className="mt-2 text-sm text-[#8B8699]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="bg-[#1C1829] border border-[#A78BFA]/30 rounded-[14px] p-12">
          <h2 className="text-3xl font-bold">Ready to ship with confidence?</h2>
          <p className="mt-3 text-[#8B8699]">
            Start monitoring your APIs in under a minute. No credit card required.
          </p>
          <a
            href="/dashboard"
            className="mt-6 inline-block bg-[#A78BFA] text-[#13111C] px-8 py-3 rounded-[10px] font-semibold hover:opacity-90 transition"
          >
            Get Started Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#8B8699]/20 py-6 text-center text-sm text-[#8B8699]/60">
        TraceFlow — API Monitoring
      </footer>
    </div>
  );
}
