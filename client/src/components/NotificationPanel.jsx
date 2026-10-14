export default function NotificationPanel({ notifications, connected }) {
  return (
    <section aria-label="Live event notifications"
      className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-indigo-900">Live Notifications</h3>
        <span className={connected ? 'text-sm text-green-700' : 'text-sm text-gray-600'}>
          {connected ? 'Live: Connected' : 'Live: Disconnected'}
        </span>
      </div>
      <div aria-live="polite" className="mt-3 space-y-2">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-600">Waiting for new event announcements...</p>
        ) : notifications.map(item => (
          <p key={item.id} className="rounded-lg bg-white p-3 text-sm text-indigo-800">
            {item.message}
          </p>
        ))}
      </div>
    </section>
  )
}
