import { useEffect, useState } from "react";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { apiFetch, ApiError } from "../lib/api";
import { Card } from "../components/ui/card";

type Me = { userId: string; isAdmin: boolean };

export function DashboardPage() {
  const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  if (!clerkEnabled) {
    return (
      <main className="min-h-screen p-6">
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="opacity-80">Auth désactivée (clé Clerk manquante).</p>
      </main>
    );
  }

  return (
    <>
      <SignedOut>
        <main className="min-h-screen p-6">
          <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
          <p className="opacity-80">Connecte-toi pour accéder au dashboard.</p>
        </main>
      </SignedOut>
      <SignedIn>
        <DashboardInner />
      </SignedIn>
    </>
  );
}

function DashboardInner() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const data = await apiFetch<Me>("/auth/me", { token });
        if (!cancelled) setMe(data);
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof ApiError ? `${e.message} (HTTP ${e.status})` : String(e);
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getToken]);

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      {loading ? <p>Chargement…</p> : null}
      {error ? <p className="text-red-600">{error}</p> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-[#d4c5f9]">
          <h2 className="text-lg font-semibold mb-2">Session</h2>
          {me ? (
            <div className="space-y-1">
              <div>
                <span className="opacity-70">userId:</span> <span className="font-mono">{me.userId}</span>
              </div>
              <div>
                <span className="opacity-70">admin:</span> <span>{String(me.isAdmin)}</span>
              </div>
            </div>
          ) : (
            <p className="opacity-70">Aucune information.</p>
          )}
        </Card>

        <Card className="p-6 border-[#d4c5f9]">
          <h2 className="text-lg font-semibold mb-2">Accès rapide</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <a className="text-[#7b3ff2] hover:underline" href="#/generate">
                Génération
              </a>
            </li>
            <li>
              <a className="text-[#7b3ff2] hover:underline" href="#/cultures">
                Cultures (CRUD)
              </a>
            </li>
            {me?.isAdmin ? (
              <li>
                <a className="text-[#7b3ff2] hover:underline" href="#/users">
                  Utilisateurs (admin)
                </a>
              </li>
            ) : null}
          </ul>
        </Card>
      </div>
    </main>
  );
}
