import { useEffect, useState } from "react";
import { apiFetch, getOutboxSize } from "../lib/api";

export function AdminPage() {
  const [health, setHealth] = useState<unknown>(null);

  useEffect(() => {
    apiFetch("/healthz").then(setHealth).catch(() => setHealth(null));
  }, []);

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin</h1>
      <div className="space-y-3">
        <div>Outbox (offline queue): {getOutboxSize()}</div>
        <div>Health: <pre className="bg-white/70 p-4 rounded-md overflow-auto">{JSON.stringify(health, null, 2)}</pre></div>
      </div>
    </main>
  );
}