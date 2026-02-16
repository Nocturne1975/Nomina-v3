import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export function UsersPage() {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/users")
      .then(setData)
      .catch((e) => setError(String(e?.message ?? e)));
  }, []);

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold mb-4">Utilisateurs</h1>
      {error ? <p className="text-red-600">{error}</p> : null}
      <pre className="bg-white/70 p-4 rounded-md overflow-auto">{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}