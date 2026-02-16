import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { UseCases } from "./components/UseCases";
import { ApiDemo } from "./components/ApiDemo";
import { Pricing } from "./components/Pricing";
import { Documentation } from "./components/Documentation";
import { Footer } from "./components/Footer";
import { useEffect, useState } from "react";
import { flushOutbox } from "./lib/api";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { GeneratePage } from "./pages/GeneratePage";
import { UsersPage } from "./pages/UsersPage";
import { AdminPage } from "./pages/AdminPage";
import { HomePage } from "./pages/HomePage";
import { FluidBackground } from "./components/FluidBackground";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CulturesPage } from "./pages/CulturesPage";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { setApiTokenProvider, apiFetch } from "./lib/api";

function ClerkTokenBridge() {
  const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
  if (!clerkEnabled) return null;
  return <ClerkTokenBridgeInner />;
}

function ClerkTokenBridgeInner() {
  const { getToken } = useAuth();

  useEffect(() => {
    setApiTokenProvider(() => getToken());
    return () => setApiTokenProvider(null);
  }, [getToken]);

  return null;
}

function RequireSignedIn(props: { children: JSX.Element }) {
  const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  if (!clerkEnabled) {
    return (
      <main className="min-h-screen p-6">
        <h1 className="text-2xl font-semibold mb-2">Accès restreint</h1>
        <p className="opacity-80">L’authentification est désactivée (clé Clerk manquante).</p>
      </main>
    );
  }

  return (
    <>
      <SignedIn>{props.children}</SignedIn>
      <SignedOut>
        <Navigate to="/login" replace />
      </SignedOut>
    </>
  );
}

function RequireAdmin(props: { children: JSX.Element }) {
  const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  if (!clerkEnabled) {
    return (
      <main className="min-h-screen p-6">
        <h1 className="text-2xl font-semibold mb-2">Admin</h1>
        <p className="opacity-80">Auth désactivée (clé Clerk manquante).</p>
      </main>
    );
  }

  return <RequireAdminInner>{props.children}</RequireAdminInner>;
}

function RequireAdminInner(props: { children: JSX.Element }) {
  const { getToken, isSignedIn } = useAuth();
  const [state, setState] = useState<
    { status: "loading" } | { status: "ok" } | { status: "forbidden" } | { status: "error"; message: string }
  >({ status: "loading" });

  useEffect(() => {
    if (!isSignedIn) return;

    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const data = await apiFetch<{ userId: string; isAdmin: boolean }>("/auth/me", { token });
        if (cancelled) return;
        setState(data.isAdmin ? { status: "ok" } : { status: "forbidden" });
      } catch (e) {
        if (cancelled) return;
        setState({ status: "error", message: String((e as any)?.message ?? e) });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getToken, isSignedIn]);

  return (
    <>
      <SignedOut>
        <Navigate to="/login" replace />
      </SignedOut>

      <SignedIn>
        {state.status === "loading" ? (
          <main className="min-h-screen p-6">Vérification des droits…</main>
        ) : state.status === "ok" ? (
          props.children
        ) : state.status === "forbidden" ? (
          <Navigate to="/" replace />
        ) : (
          <main className="min-h-screen p-6">
            <h1 className="text-2xl font-semibold mb-2">Erreur</h1>
            <p className="text-red-600">{state.message}</p>
          </main>
        )}
      </SignedIn>
    </>
  );
}

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "";

  useEffect(() => {
    // Tente une synchro au démarrage (si des requêtes offline existent).
    flushOutbox().catch(() => undefined);

    const onOnline = () => {
      flushOutbox().catch(() => undefined);
    };
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FluidBackground variant="light" />
      <Header />
      <ClerkTokenBridge />
      {!isHome ? (
        <div className="pointer-events-none fixed top-20 inset-x-0 z-40 h-7 bg-gradient-to-b from-[#2d1b4e]/70 via-[#2d1b4e]/20 to-transparent" />
      ) : null}
      <main>      
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/usecases" element={<UseCases />} />
          <Route path="/demo" element={<ApiDemo />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/dashboard" element={<RequireSignedIn><DashboardPage /></RequireSignedIn>} />
          <Route path="/cultures" element={<RequireSignedIn><CulturesPage /></RequireSignedIn>} />
          <Route path="/users" element={<RequireAdmin><UsersPage /></RequireAdmin>} />
          <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>   
      </main>
      <Footer />
    </div>
  );
}
