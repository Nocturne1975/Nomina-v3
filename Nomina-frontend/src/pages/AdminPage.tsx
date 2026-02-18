import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch, getOutboxSize } from "../lib/api";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function AdminPage() {
  const [health, setHealth] = useState<unknown>(null);

  useEffect(() => {
    apiFetch("/healthz").then(setHealth).catch(() => setHealth(null));
  }, []);

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin</h1>

      <Card className="p-4 border-[#d4c5f9] mb-6">
        <h2 className="text-lg font-semibold mb-3">CRUD</h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/cultures">Cultures</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/categories">Catégories</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/concepts">Concepts</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/titres">Titres</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/fragments-histoire">Fragments d’histoire</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/nom-personnages">Noms de personnages</Link>
          </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/univers">Univers thématiques</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/nom-familles">Noms de famille</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/lieux">Lieux</Link>
            </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/users">Utilisateurs</Link>
          </Button>
        </div>
      </Card>

      <div className="space-y-3">
        <div>Outbox (offline queue): {getOutboxSize()}</div>
        <div>
          Health:
          <pre className="bg-white/70 p-4 rounded-md overflow-auto">{JSON.stringify(health, null, 2)}</pre>
        </div>
      </div>
    </main>
  );
}