// Strip preview-injected __lovable_token BEFORE any imports so the
// Supabase auth client never sees it as an OAuth/magic-link callback.
(function stripPreviewToken() {
  try {
    const u = new URL(window.location.href);
    if (u.searchParams.has("__lovable_token")) {
      u.searchParams.delete("__lovable_token");
      window.history.replaceState({}, "", u.toString());
    }
  } catch {}
})();

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
