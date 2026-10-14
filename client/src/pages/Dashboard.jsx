import { useState, useEffect } from 'react'
import { useEvents } from '../hooks/useEvents'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../hooks/useNotifications'
import NotificationPanel from '../components/NotificationPanel'

// Visual styling per category (data comes from the custom hook, styling stays in the UI layer)
const categoryStyles = {
  Technology: {
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200/60',
    accentColor: 'from-violet-500 to-indigo-600',
    tab: 'bg-violet-50 text-violet-700 shadow-xs border border-violet-100',
  },
  Hackathon: {
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    accentColor: 'from-emerald-500 to-teal-600',
    tab: 'bg-emerald-50 text-emerald-700 shadow-xs border border-emerald-100',
  },
  Workshop: {
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/60',
    accentColor: 'from-amber-500 to-orange-500',
    tab: 'bg-amber-50 text-amber-700 shadow-xs border border-amber-100',
  },
  Cultural: {
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200/60',
    accentColor: 'from-rose-500 to-pink-600',
    tab: 'bg-rose-50 text-rose-700 shadow-xs border border-rose-100',
  },
}

const defaultStyle = {
  badgeColor: 'bg-zinc-50 text-zinc-700 border-zinc-200/60',
  accentColor: 'from-violet-500 to-indigo-600',
  tab: 'bg-white text-zinc-900 shadow-xs',
}

const filterTabs = ['All', 'Technology', 'Hackathon', 'Workshop', 'Cultural']

export default function Dashboard() {
  const { events, loading, error, reloadEvents } = useEvents()
  const { notifications, connected } = useNotifications()
  const [registeredIds, setRegisteredIds] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const toggleRegister = (id) => {
    setRegisteredIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const eventsList = Array.isArray(events)
    ? events
    : Array.isArray(events?.data)
    ? events.data
    : []

  const filteredEvents =
    activeFilter === 'All'
      ? eventsList
      : eventsList.filter((e) => e.category === activeFilter)

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-violet-500 selection:text-white">
      {/* Background soft ambient dot grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_20%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      {/* Ambient color blobs */}
      <div className="absolute top-[-100px] right-[-60px] w-[350px] h-[350px] bg-indigo-200/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[200px] left-[-80px] w-[300px] h-[300px] bg-rose-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

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
              href="/"
              className="text-sm font-medium text-zinc-600 hover:text-violet-600 px-3.5 py-2 rounded-xl hover:bg-violet-50/80 transition-all duration-200"
            >
              Home
            </a>
            <button
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className="text-sm font-semibold text-zinc-700 hover:text-rose-600 px-3.5 py-2 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all duration-200 cursor-pointer"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-6xl mx-auto px-4 pt-10 pb-20">
        {/* Welcome Banner */}
        <div className="animate-slide-up bg-gradient-to-br from-zinc-50 via-violet-50/30 to-indigo-50/30 border border-zinc-200/80 rounded-3xl p-6 sm:p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-100/80 to-indigo-100/60 text-violet-700 mb-3">
              <span>Hi, {user.email} ({user.role})</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              Your Dashboard
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Events loaded using a reusable React custom hook.
            </p>
          </div>

          {/* Quick Counter Chips */}
          <div className="flex items-center gap-3">
            <div className="bg-white border border-violet-100 rounded-2xl px-4 py-3 text-center min-w-[100px] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <span className="text-xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                {loading ? '–' : eventsList.length}
              </span>
              <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Available</p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-2xl px-4 py-3 text-center min-w-[100px] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <span className="text-xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{registeredIds.length}</span>
              <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Enrolled</p>
            </div>
          </div>
        </div>

        {/* Live Notification Panel */}
        <NotificationPanel notifications={notifications} connected={connected} />

        {/* Filter Tabs + Refresh */}
        <div className="animate-slide-up-delay-1 flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100/80 rounded-xl overflow-x-auto max-w-full">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeFilter === tab
                    ? (categoryStyles[tab] || defaultStyle).tab
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {!loading && !error && (
              <span className="text-xs font-medium text-zinc-500">
                Showing {filteredEvents.length} event{filteredEvents.length === 1 ? '' : 's'}
              </span>
            )}
            <button
              id="refresh-events"
              onClick={reloadEvents}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 hover:-translate-y-0.5 active:scale-98 transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <span className={loading ? 'animate-spin inline-block' : 'inline-block'}>↻</span>
              Refresh Events
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div role="status" aria-live="polite">
            <div className="flex items-center justify-center gap-2.5 rounded-2xl border border-zinc-200/80 bg-white p-6 text-sm font-semibold text-zinc-600 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
              <span className="w-4 h-4 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin"></span>
              Loading events...
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-6 bg-white rounded-2xl border border-zinc-200/80 animate-pulse">
                  <div className="h-5 w-24 rounded-lg bg-zinc-100" />
                  <div className="mt-4 h-6 w-3/4 rounded-lg bg-zinc-100" />
                  <div className="mt-2 h-4 w-1/2 rounded-lg bg-zinc-100" />
                  <div className="mt-6 h-10 w-full rounded-xl bg-zinc-100" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <button
              onClick={reloadEvents}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-500/20 active:scale-98 transition-all duration-200 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Admin Notice */}
        {user?.role === 'admin' && (
          <div className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-sm font-medium animate-fade-in">
            Admin access: You can manage EventHub events.
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-16 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl animate-fade-in">
            <p className="text-sm font-semibold text-zinc-700">No events found for &quot;{activeFilter}&quot;</p>
            <p className="text-xs text-zinc-500 mt-1">Try selecting another filter tab or refresh events.</p>
            <button
              onClick={() => setActiveFilter('All')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors cursor-pointer"
            >
              Show All Events
            </button>
          </div>
        )}

        {/* Event Cards Grid */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((e, i) => {
              const eventId = e._id || e.id || i
              const isRegistered = registeredIds.includes(eventId)
              const style = categoryStyles[e.category] || defaultStyle

              return (
                <article
                  key={eventId}
                  className={`animate-slide-up-delay-${(i % 3) + 1} group p-6 bg-white rounded-2xl border border-zinc-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(99,91,255,0.09)] hover:-translate-y-1.5 hover:border-violet-300 transition-all duration-300 ease-out flex flex-col justify-between relative overflow-hidden`}
                >
                  {/* Colored top accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg border ${style.badgeColor}`}>
                        {e.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-xl text-zinc-900 group-hover:text-violet-600 transition-colors">
                      {e.title}
                    </h3>

                    <div className="mt-3.5 p-3 rounded-xl bg-zinc-50/80 border border-zinc-100 text-xs text-zinc-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Date:</span>
                        <span className="font-medium text-zinc-700">{e.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Venue:</span>
                        <span className="font-medium text-zinc-700">{e.venue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-100">
                    <button
                      onClick={() => toggleRegister(eventId)}
                      className={`w-full py-2.5 px-4 text-xs font-semibold rounded-xl active:scale-98 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                        isRegistered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100/70'
                          : `bg-gradient-to-r ${style.accentColor} text-white shadow-md hover:shadow-lg hover:-translate-y-0.5`
                      }`}
                    >
                      {isRegistered ? (
                        <>
                          <span className="font-bold">✓</span> Registered
                        </>
                      ) : (
                        'Register'
                      )}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
