export default function Home() {
  const sampleEvents = [
    {
      title: 'Tech Fest',
      category: 'Innovation & Tech',
      date: 'Oct 10, 2026',
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-200/60',
      accentColor: 'from-violet-500 to-indigo-600',
      iconBg: 'bg-gradient-to-br from-violet-500 to-indigo-600',
      description: 'Robotics exhibits, drone races, and national coding challenges.',
    },
    {
      title: 'Hackathon',
      category: '24h Build-a-thon',
      date: 'Oct 15, 2026',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      accentColor: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      description: 'Collaborate with top developers to solve real-world industry problems.',
    },
    {
      title: 'Cultural Night',
      category: 'Arts & Music',
      date: 'Oct 20, 2026',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/60',
      accentColor: 'from-amber-500 to-rose-500',
      iconBg: 'bg-gradient-to-br from-amber-500 to-rose-500',
      description: 'Live musical performances, drama competitions, and celebrity acts.',
    },
  ]

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-violet-500 selection:text-white">
      {/* Subtle background ambient dot grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_20%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      {/* Soft color blobs for ambient warmth */}
      <div className="absolute top-[-120px] left-[-80px] w-[400px] h-[400px] bg-violet-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[100px] right-[-100px] w-[350px] h-[350px] bg-amber-200/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[-80px] left-[30%] w-[300px] h-[300px] bg-emerald-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating Island Navigation */}
      <header className="sticky top-4 z-50 max-w-6xl mx-auto px-4 animate-fade-in">
        <div className="bg-white/80 backdrop-blur-md border border-zinc-200/80 rounded-2xl px-5 py-3.5 flex justify-between items-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all">
          <a href="/" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
              E
            </span>
            <span className="text-xl font-bold tracking-tight text-zinc-900">
              Event<span className="text-violet-600">Hub</span>
            </span>
          </a>
          <nav className="flex items-center gap-2 sm:gap-4">
            <a
              href="/login"
              className="text-sm font-medium text-zinc-600 hover:text-violet-600 px-3.5 py-2 rounded-xl hover:bg-violet-50/80 transition-all duration-200"
            >
              Login
            </a>
            <a
              href="/dashboard"
              className="text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 px-4 py-2 rounded-xl shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 hover:-translate-y-0.5 active:scale-98 transition-all duration-200"
            >
              Dashboard
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto">
          {/* Eyebrow Tag with live pulse */}
          <div className="animate-slide-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 border border-violet-100 mb-6 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-600"></span>
            </span>
            Campus Season 2026 Live
          </div>

          <h2 className="animate-slide-up-delay-1 text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.12]">
            College Events,{' '}
            <span className="animate-shimmer bg-gradient-to-r from-violet-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              Simplified
            </span>
          </h2>
          <p className="animate-slide-up-delay-2 mt-5 text-base sm:text-lg text-zinc-600 max-w-xl mx-auto leading-relaxed">
            Browse, register, and manage college events in one place. Discover upcoming hackathons, fests, and workshops.
          </p>

          <div className="animate-slide-up-delay-3 mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:scale-98 transition-all duration-200 group"
            >
              Explore Events
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 group-hover:translate-x-0.5 transition-transform text-xs">
                →
              </span>
            </a>
            <a
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold rounded-xl border border-zinc-200/90 shadow-xs hover:border-violet-200 hover:text-violet-700 transition-all duration-200"
            >
              Sign In to Register
            </a>
          </div>

          {/* Quick Metrics Strip */}
          <div className="animate-slide-up-delay-3 mt-12 pt-8 border-t border-zinc-100 grid grid-cols-3 gap-4 text-center max-w-lg mx-auto">
            <div>
              <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">30+</div>
              <div className="text-xs text-zinc-500 mt-0.5">Live Events</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">5k+</div>
              <div className="text-xs text-zinc-500 mt-0.5">Participants</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">100%</div>
              <div className="text-xs text-zinc-500 mt-0.5">Free Access</div>
            </div>
          </div>
        </section>

        {/* Featured Events Grid */}
        <section className="mt-16 sm:mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2 animate-slide-up">
            <div>
              <h3 className="text-xs font-bold tracking-wider bg-gradient-to-r from-violet-600 to-rose-500 bg-clip-text text-transparent uppercase">Upcoming Highlights</h3>
              <p className="text-2xl font-bold text-zinc-900 tracking-tight mt-1">Featured Campus Gatherings</p>
            </div>
            <a href="/dashboard" className="text-sm font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1 group">
              View all events <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sampleEvents.map((event, i) => (
              <div
                key={event.title}
                className={`animate-slide-up-delay-${i + 1} group relative p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 hover:border-violet-300/80 transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden`}
              >
                {/* Colored top accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${event.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${event.badgeColor}`}>
                      {event.category}
                    </span>
                    <span className="text-xs font-medium text-zinc-400">{event.date}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <span className={`w-9 h-9 rounded-xl ${event.iconBg} flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      {event.title[0]}
                    </span>
                    <h3 className="font-bold text-xl text-zinc-900 group-hover:text-violet-600 transition-colors">
                      {event.title}
                    </h3>
                  </div>
                  <p className="text-xs font-medium text-zinc-400 mt-1">VESIT, Mumbai - Coming soon</p>

                  <p className="text-sm text-zinc-600 mt-3 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft"></span> Open for Registration
                  </span>
                  <a
                    href="/dashboard"
                    className={`text-xs font-semibold text-zinc-500 hover:text-transparent hover:bg-gradient-to-r ${event.accentColor} hover:bg-clip-text flex items-center gap-1 transition-all duration-200`}
                  >
                    Details ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
