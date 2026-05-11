export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-purple-600/30 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] animate-pulse [animation-delay:1s]" />
      <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-600/10 blur-[100px] animate-pulse [animation-delay:2s]" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span className="text-xl font-bold tracking-tight">
          <span className="text-purple-400">Trace</span>Flow
        </span>
        <a
          href="/dashboard"
          className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition"
        >
          Dashboard
        </a>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Monitor your APIs in{" "}
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            real-time
          </span>
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
          Track requests, debug errors, and get insights on every API call. TraceFlow gives you
          full visibility into your endpoints.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="/dashboard"
            className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Get Started →
          </a>
          <a
            href="/dashboard"
            className="border border-gray-700 text-gray-300 px-6 py-3 rounded-full font-semibold hover:border-gray-500 transition"
          >
            View Dashboard
          </a>
        </div>
      </section>

      {/* Floating card preview */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-gray-500 font-mono">dashboard</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm font-mono text-gray-300">GET /api/users</span>
              <span className="ml-auto text-xs text-green-400">200 — 12ms</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-sm font-mono text-gray-300">POST /api/orders</span>
              <span className="ml-auto text-xs text-yellow-400">201 — 45ms</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-sm font-mono text-gray-300">DELETE /api/cache</span>
              <span className="ml-auto text-xs text-red-400">500 — 2300ms</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between text-xs text-gray-500">
            <span>12 requests in last 5 min</span>
            <span>99.2% uptime</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
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
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition"
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-3 font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-800/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold">Ready to ship with confidence?</h2>
          <p className="mt-3 text-gray-400">
            Start monitoring your APIs in under a minute. No credit card required.
          </p>
          <a
            href="/dashboard"
            className="mt-6 inline-block bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Get Started Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-900 py-6 text-center text-sm text-gray-600">
        TraceFlow — API Monitoring
      </footer>
    </div>
  );
}
