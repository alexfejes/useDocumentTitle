import { useEffect, useRef, useState } from "react";
// vvv UNCOMMENT (fix 2 of 3) vvv
// import { useDocumentTitle } from "./hooks/useDocumentTitle.js";
import "./App.css";

const SENDER = "Developer";
const BATCH_SIZE = 3;
const DELAY_MS = 3000; // gap between notifications, so there's time to switch tabs
const SNIPPETS = [
  "Can you review my PR when you get a sec?",
  "Deploy finished, all green.",
  "Lunch at 12:30?",
  "The client approved the mockups!",
  "Heads up: standup moved to 10am.",
  "New update available for the dashboard.",
];

let nextId = 1;
function makeMessage() {
  return {
    id: nextId++,
    from: SENDER,
    text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    read: false,
  };
}

function App() {
  const [messages, setMessages] = useState([]);
  const [pending, setPending] = useState(0);
  const timers = useRef([]);

  // Cancel any scheduled notifications if the component unmounts.
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Send 3 notifications, one every DELAY_MS, then stop.
  const sendNotifications = () => {
    setPending(BATCH_SIZE);
    timers.current = Array.from({ length: BATCH_SIZE }, (_, i) =>
      setTimeout(
        () => {
          setMessages((prev) => [makeMessage(), ...prev]);
          setPending((p) => p - 1);
        },
        DELAY_MS * (i + 1),
      ),
    );
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  /*
   * THE BUG: unreadCount is shown on the page below, but nothing ever writes it
   * to the browser tab. The tab title stays "Dashboard" (from index.html) forever,
   * so a user who has this tab in the background never sees new messages.
   *
   * THE FIX: the line below puts the unread count in the tab title. When
   * unreadCount is 0 the title is plain "Dashboard"; otherwise it becomes e.g.
   * "(3) New Notifications - Dashboard". The hook re-runs
   * whenever this string changes, so the tab updates live as messages arrive
   * and as they get marked read.
   */
  // vvv UNCOMMENT (fix 3 of 3) vvv
  // useDocumentTitle(
  //   unreadCount > 0
  //     ? `(${unreadCount}) New Notifications - Dashboard`
  //     : "Dashboard",
  // );

  const markRead = (id) =>
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
    );
  const markAllRead = () =>
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));

  return (
    <main className="inbox">
      <header className="inbox-header">
        <h1>
          Dashboard{" "}
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </h1>
        <div className="actions">
          <button
            type="button"
            onClick={sendNotifications}
            disabled={pending > 0}
          >
            {pending > 0
              ? `Sending… (${pending} left)`
              : "Send 3 notifications"}
          </button>
          <button
            type="button"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            Mark all read
          </button>
        </div>
      </header>

      <p className="hint">
        Click "Send 3 notifications", then switch to another browser tab. The
        tab title stays "Dashboard" until you enable the fix in{" "}
        <code>src/hooks/useDocumentTitle.js</code>.
      </p>

      {messages.length === 0 ? (
        <p className="empty">No messages yet.</p>
      ) : (
        <ul className="messages">
          {messages.map((m) => (
            <li key={m.id} className={m.read ? "read" : "unread"}>
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
  );
}

export default App;
