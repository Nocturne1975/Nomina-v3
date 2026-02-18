import { useSignIn, useUser } from "@clerk/clerk-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";

export function LoginPage() {
	const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
	const navigate = useNavigate();
	const { isSignedIn } = useUser();
	const { isLoaded, signIn, setActive } = useSignIn();

	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const canSubmit = useMemo(() => {
		return !pending && !isSignedIn && email.trim().length > 0 && password.trim().length > 0;
	}, [email, isSignedIn, password, pending]);

	useEffect(() => {
		if (!clerkEnabled) return;
		if (isSignedIn) navigate("/dashboard", { replace: true });
	}, [clerkEnabled, isSignedIn, navigate]);

	async function handleSubmit() {
		if (!clerkEnabled) return;
		if (isSignedIn) return;
		if (!isLoaded) return;
		if (!signIn) return;

		setError(null);
		setPending(true);
		try {
			const res = await signIn.create({ identifier: email.trim(), password });
			if (res.status === "complete") {
				await setActive?.({ session: res.createdSessionId });
				navigate("/dashboard", { replace: true });
				return;
			}

			setError(
				"Connexion partielle: une étape additionnelle est requise (ex.: 2FA) selon la configuration Clerk."
			);
		} catch (e: any) {
			const msg =
				e?.errors?.[0]?.longMessage ||
				e?.errors?.[0]?.message ||
				e?.message ||
				"Impossible de se connecter.";
			setError(String(msg));
		} finally {
			setPending(false);
		}
	}

	async function startOAuth(strategy: "oauth_google" | "oauth_facebook" | "oauth_github") {
		if (!clerkEnabled) return;
		if (!isLoaded) return;
		if (!signIn) return;
		setError(null);
		try {
			await signIn.authenticateWithRedirect({
				strategy,
				redirectUrl: "/sso-callback",
				redirectUrlComplete: "/dashboard",
			});
		} catch (e: any) {
			const msg =
				e?.errors?.[0]?.longMessage ||
				e?.errors?.[0]?.message ||
				e?.message ||
				"Impossible de démarrer la connexion OAuth.";
			setError(String(msg));
		}
	}

	return (
		<main className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-b from-violet-50 via-white to-pink-50">
			<div className="w-full max-w-[480px]">
				<h1 className="text-3xl font-semibold mb-4">Connexion</h1>
				{clerkEnabled && isSignedIn ? (
					<p className="text-sm opacity-80 mb-4">Tu es déjà connecté. Redirection…</p>
				) : (
				<p className="text-sm opacity-80 mb-4">
					Pas encore de compte ?{" "}
					<Link to="/register" className="text-[#7b3ff2] hover:underline">
						S’inscrire
					</Link>
				</p>
				)}
				<Card className="bg-white border-[#d4c5f9] p-6">
					{clerkEnabled ? (
						<div className="space-y-4">
							{error ? <p className="text-sm text-red-600">{error}</p> : null}
							<div className="space-y-2">
								<p className="text-sm opacity-80">Se connecter avec</p>
								<div className="flex flex-col gap-2">
									<Button
										variant="outline"
										onClick={() => startOAuth("oauth_google").catch(() => undefined)}
										disabled={pending}
									>
										Google
									</Button>
									<Button
										variant="outline"
										onClick={() => startOAuth("oauth_github").catch(() => undefined)}
										disabled={pending}
									>
										GitHub
									</Button>
									<Button
										variant="outline"
										onClick={() => startOAuth("oauth_facebook").catch(() => undefined)}
										disabled={pending}
									>
										Facebook
									</Button>
								</div>
								<p className="text-xs opacity-70">
									Ces options apparaissent seulement si elles sont activées dans Clerk.
								</p>
							</div>
							<div className="h-px bg-[#d4c5f9]" />
							<div>
								<label className="text-sm opacity-80">Courriel</label>
								<Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
							</div>
							<div>
								<label className="text-sm opacity-80">Mot de passe</label>
								<Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
							</div>
							<Button onClick={() => handleSubmit().catch(() => undefined)} disabled={!canSubmit}>
								{pending ? "Connexion…" : "Se connecter"}
							</Button>
						</div>
					) : (
						<div className="text-[#2d1b4e]">
							<p className="mb-2">L’authentification est désactivée.</p>
							<p className="text-sm opacity-80">
								Ajoute <code>VITE_CLERK_PUBLISHABLE_KEY</code> dans l’environnement pour activer la connexion.
							</p>
						</div>
					)}
				</Card>
			</div>
		</main>
	);
}

