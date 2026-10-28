import { useEffect, useState } from 'react'

const categories = ['Technology', 'Hackathon', 'Workshop', 'Cultural', 'General']

const inputClass =
  'w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200'
const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5'

function toFormState(event) {
  return {
    title: event?.title ?? '',
    date: event?.date ?? '',
    venue: event?.venue ?? '',
    category: event?.category ?? 'Technology',
    description: event?.description ?? '',
    capacity: event?.capacity ? String(event.capacity) : '',
  }
}

// Create/edit modal for admins. onSubmit(payload) should throw the apiRequest error on failure.
export default function EventForm({ event, onSubmit, onClose }) {
  const isEdit = Boolean(event)
  const [form, setForm] = useState(() => toFormState(event))
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const onKeyDown = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const update = (field) => (e) => setForm((current) => ({ ...current, [field]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')
    setErrors([])

    // Validation is left to the API so its 400 errors array is shown as-is
    const payload = {
      title: form.title.trim(),
      date: form.date,
      venue: form.venue.trim(),
      category: form.category,
      description: form.description.trim(),
      capacity: form.capacity === '' ? 0 : Number(form.capacity),
    }

    try {
      await onSubmit(payload)
    } catch (error) {
      setMessage(error.message)
      setErrors(error.errors || [])
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center overflow-y-auto bg-zinc-900/30 backdrop-blur-sm px-4 py-8 animate-fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-form-title"
        className="animate-slide-up w-full max-w-lg bg-white rounded-3xl border border-zinc-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06),0_20px_48px_-12px_rgba(0,0,0,0.08)] p-6 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="event-form-title" className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900">
              {isEdit ? 'Edit Event' : 'Create Event'}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-500">
              {isEdit ? 'Changes are announced live to everyone on the dashboard.' : 'New events appear instantly on every dashboard.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 shrink-0 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="event-title" className={labelClass}>Title</label>
            <input id="event-title" type="text" value={form.title} onChange={update('title')} className={inputClass} placeholder="e.g. AI Workshop" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="event-date" className={labelClass}>Date</label>
              <input id="event-date" type="date" value={form.date} onChange={update('date')} className={inputClass} />
            </div>
            <div>
              <label htmlFor="event-category" className={labelClass}>Category</label>
              <select id="event-category" value={form.category} onChange={update('category')} className={inputClass}>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
            <div>
              <label htmlFor="event-venue" className={labelClass}>Venue</label>
              <input id="event-venue" type="text" value={form.venue} onChange={update('venue')} className={inputClass} placeholder="e.g. Seminar Hall" />
            </div>
            <div>
              <label htmlFor="event-capacity" className={labelClass}>Capacity</label>
              <input id="event-capacity" type="number" min="0" step="1" value={form.capacity} onChange={update('capacity')} className={inputClass} placeholder="Unlimited" />
            </div>
          </div>

          <div>
            <label htmlFor="event-description" className={labelClass}>Description</label>
            <textarea id="event-description" rows={3} value={form.description} onChange={update('description')} className={`${inputClass} resize-none`} placeholder="What's this event about?" />
          </div>

          <div aria-live="polite" role="status">
            {message && (
              <div id="event-form-errors" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-700 animate-slide-up">
                <p className="font-semibold">{message}</p>
                {errors.length > 0 && (
                  <ul className="mt-1.5 list-disc pl-5 space-y-0.5">
                    {errors.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="event-form-submit"
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>}
              {isEdit ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
