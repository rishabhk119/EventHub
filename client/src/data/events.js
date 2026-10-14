export const mockEvents = [
  {
    id: 1,
    title: 'Tech Fest 2026',
    date: '2026-10-10',
    venue: 'Main Ground',
    category: 'Technology',
  },
  {
    id: 2,
    title: 'AI Workshop',
    date: '2026-10-15',
    venue: 'Lab 3',
    category: 'Workshop',
  },
  {
    id: 3,
    title: 'Cultural Night',
    date: '2026-10-20',
    venue: 'Auditorium',
    category: 'Cultural',
  },
]

export function fetchEvents() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEvents)
    }, 1000)
  })
}
