/*
 * ============================================================================
 * useDocumentTitle — THE FIX (currently commented out)
 * ============================================================================
 *
 * HOW TO ENABLE (3 spots total):
 *   1. This file: select everything between the UNCOMMENT banners below
 *      and press Ctrl+/ (Cmd+/ on Mac).
 *   2. src/App.jsx: uncomment the import line under its banner.
 *   3. src/App.jsx: uncomment the useDocumentTitle(...) call under its banner.
 *
 * THE PROBLEM
 *   The <title> in index.html is set once ("Dashboard") and nothing in React ever
 *   touches it again. React only manages what is inside <div id="root">, so
 *   the browser tab is outside its reach. When the user switches to another
 *   tab, new messages keep arriving but the tab still says "Dashboard".
 *
 * THE FIX
 *   Write to `document.title` from React. That is a browser side effect, so it
 *   belongs in a `useEffect`. Wrapping it in a custom hook means any component
 *   can say "while I'm mounted, the tab title is X" in one line, and the title
 *   updates every time X changes (e.g. "(3) New Notifications - Dashboard").
 *
 * LINE NOTES (match the (n) markers in the code)
 *   (1) Remember the title the page had *before* this component took over
 *       ("Dashboard" from index.html). useRef's initial value is only read on the
 *       first render, so later re-renders don't overwrite it with the "(3) ..." title.
 *   (2) Sync the tab title with `title`. The dependency array [title] means
 *       this runs after the first render and again only when the string
 *       actually changes, not on every render.
 *   (3) Cleanup on unmount. Without it, leaving the inbox page (e.g. routing
 *       to Settings) would leave a stale "(3) New Notifications" in the tab forever. The
 *       ref is copied into a local so cleanup uses the value from when the
 *       effect ran.
 *   (4) This is a separate effect from (2) on purpose: if combined, the
 *       cleanup would also run on every title change and briefly flicker the
 *       tab back to the original title between updates.
 * ============================================================================
 */

import { useEffect, useRef } from "react";

export function useDocumentTitle(title, { restoreOnUnmount = true } = {}) {
  const originalTitle = useRef(document.title); // (1)

  useEffect(() => {
    document.title = title; // (2)
  }, [title]);

  useEffect(() => {
    const original = originalTitle.current; // (3)
    return () => {
      if (restoreOnUnmount) document.title = original;
    };
  }, [restoreOnUnmount]); // (4)
}
