import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const inputClass =
  'w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  async function handleSubmit(event) {
    event.preventDefault()

    if (!name.trim() || !email.trim() || !password) {
      setMessage('Please fill in your name, email and password.')
      return
    }

    if (password.length < 6) {
      setMessage('Password must contain at least 6 characters.')
      return
    }

    setSubmitting(true)
    setMessage('')
    try {
      await register(name.trim(), email.trim(), password)
      navigate('/dashboard')
    } catch (error) {
      // e.g. 409 "Email is already registered"
      setMessage(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 py-12 relative selection:bg-violet-500 selection:text-white">
      {/* Background soft ambient grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      {/* Ambient color blobs */}
      <div className="absolute top-[10%] right-[15%] w-[300px] h-[300px] bg-violet-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[15%] left-[10%] w-[250px] h-[250px] bg-emerald-200/25 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Back to Home Button */}
      <div className="w-full max-w-md mb-6 animate-fade-in">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-violet-600 transition-colors"
        >
          ← Back to Home
        </a>
      </div>

      {/* Auth Card Container */}
      <div className="animate-slide-up w-full max-w-md bg-white rounded-3xl border border-zinc-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06),0_20px_48px_-12px_rgba(0,0,0,0.04)] p-8 sm:p-10 transition-all">
        {/* Brand Icon & Heading */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-violet-500/25 mx-auto mb-4 hover:scale-105 transition-transform duration-300">
            E
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
            Join Event<span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Hub</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500">
            Create an account to register for campus events
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              College Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
              placeholder="you@vesit.ac.in"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
          </div>

          <button
            id="register-submit"
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 active:scale-98 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {submitting && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>}
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div aria-live="polite" role="status">
          {message && (
            <p
              id="register-message"
              className="mt-4 rounded-xl border p-3 text-xs sm:text-sm font-semibold text-center animate-slide-up bg-red-50 border-red-200 text-red-700"
            >
              {message}
            </p>
          )}
        </div>

        <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
          <p className="text-xs text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent hover:from-violet-700 hover:to-indigo-700 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
