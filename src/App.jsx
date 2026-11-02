import { useEffect, useState } from 'react'
// vvv UNCOMMENT (fix 2 of 3) vvv
// import { useDocumentTitle } from './hooks/useDocumentTitle.js'
import './App.css'

const SENDERS = ['Ava', 'Ben', 'Chloe', 'Dev', 'Elena', 'Farid']
const SNIPPETS = [
  'Can you review my PR when you get a sec?',
  'Deploy finished, all green.',
  'Lunch at 12:30?',
  'The client approved the mockups!',
  'Heads up: standup moved to 10am.',
  'New update available for the dashboard.',
]

let nextId = 1
function makeMessage() {
  return {
    id: nextId++,
    from: SENDERS[Math.floor(Math.random() * SENDERS.length)],
    text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    read: false,
  }
}

function App() {
  const [messages, setMessages] = useState([])

  // Simulate a live feed: a new message arrives every 4 seconds.
  useEffect(() => {
    const id = setInterval(() => {
      setMessages((prev) => [makeMessage(), ...prev])
    }, 4000)
    return () => clearInterval(id)
  }, [])

  const unreadCount = messages.filter((m) => !m.read).length

  /*
   * THE BUG: unreadCount is shown on the page below, but nothing ever writes it
   * to the browser tab. The tab title stays "Inbox" (from index.html) forever,
   * so a user who has this tab in the background never sees new messages.
   *
   * THE FIX: the line below puts the unread count in the tab title. When
   * unreadCount is 0 the title is plain "Inbox"; otherwise it becomes e.g.
   * "(3) Inbox", the convention Gmail, Slack, etc. use. The hook re-runs
   * whenever this string changes, so the tab updates live as messages arrive
   * and as they get marked read.
   */
  // vvv UNCOMMENT (fix 3 of 3) vvv
  // useDocumentTitle(unreadCount > 0 ? `(${unreadCount}) Inbox` : 'Inbox')

  const markRead = (id) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)))
  const markAllRead = () => setMessages((prev) => prev.map((m) => ({ ...m, read: true })))

  return (
    <main className="inbox">
      <header className="inbox-header">
        <h1>
          Inbox {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </h1>
        <button type="button" onClick={markAllRead} disabled={unreadCount === 0}>
          Mark all read
        </button>
      </header>

      <p className="hint">
        Switch to another browser tab and wait a few seconds. The tab title stays
        "Inbox" until you enable the fix in <code>src/hooks/useDocumentTitle.js</code>.
      </p>

      {messages.length === 0 ? (
        <p className="empty">Waiting for messages…</p>
      ) : (
        <ul className="messages">
          {messages.map((m) => (
            <li key={m.id} className={m.read ? 'read' : 'unread'}>
              <button type="button" onClick={() => markRead(m.id)}>
                <span className="from">{m.from}</span>
                <span className="text">{m.text}</span>
                <span className="time">{m.time}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
