import { useSignUp, useUser } from "@clerk/clerk-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";

export function RegisterPage() {
	const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
	const navigate = useNavigate();
	const { isSignedIn } = useUser();
	const { isLoaded, signUp, setActive } = useSignUp();

	const [step, setStep] = useState<"form" | "verify-email">("form");
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [emailCode, setEmailCode] = useState("");

	const canSubmit = useMemo(() => {
		if (pending) return false;
		if (isSignedIn) return false;
		if (step === "verify-email") return emailCode.trim().length > 0;
		return (
			firstName.trim().length > 0 &&
			lastName.trim().length > 0 &&
			email.trim().length > 0 &&
			password.trim().length >= 8
		);
	}, [email, emailCode, firstName, isSignedIn, lastName, password, pending, step]);

	useEffect(() => {
		if (!clerkEnabled) return;
		if (isSignedIn) navigate("/dashboard", { replace: true });
	}, [clerkEnabled, isSignedIn, navigate]);

	async function handleSubmit() {
		if (!clerkEnabled) return;
		if (isSignedIn) return;
		if (!isLoaded) return;
		if (!signUp) return;

		setError(null);
		setPending(true);
		try {
			if (step === "form") {
				await signUp.create({
					emailAddress: email.trim(),
					password: password,
					firstName: firstName.trim(),
					lastName: lastName.trim(),
					...(phone.trim()
						? {
							phoneNumber: phone.trim(),
						}
						: {}),
				});

				// Selon la config Clerk, une vérification email peut être requise.
				// On tente email_code, sinon on laisse Clerk gérer d'autres stratégies.
				try {
					await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
					setStep("verify-email");
					return;
				} catch {
					// Si aucune vérification n'est requise, Clerk peut être déjà "complete".
					if (signUp.status === "complete") {
						await setActive?.({ session: signUp.createdSessionId });
						navigate("/dashboard", { replace: true });
						return;
					}
					setError(
						"Inscription créée, mais une vérification additionnelle est requise selon la configuration Clerk."
					);
					return;
				}
			}

			// Step verify email
			const attempt = await signUp.attemptEmailAddressVerification({ code: emailCode.trim() });
			if (attempt.status === "complete") {
				await setActive?.({ session: attempt.createdSessionId });
				navigate("/dashboard", { replace: true });
				return;
			}

			setError("Code invalide ou expiré. Réessaie.");
		} catch (e: any) {
			const msg =
				e?.errors?.[0]?.longMessage ||
				e?.errors?.[0]?.message ||
				e?.message ||
				"Impossible de créer le compte.";
			setError(String(msg));
		} finally {
			setPending(false);
		}
	}

	return (
		<main className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-b from-violet-50 via-white to-pink-50">
			<div className="w-full max-w-[480px]">
				<h1 className="text-3xl font-semibold mb-4">Créer un compte</h1>
				{clerkEnabled && isSignedIn ? (
					<p className="text-sm opacity-80 mb-4">Tu es déjà connecté. Redirection…</p>
				) : (
				<p className="text-sm opacity-80 mb-4">
					Déjà un compte ? <Link to="/login" className="text-[#7b3ff2] hover:underline">Se connecter</Link>
				</p>
				)}
				<Card className="bg-white border-[#d4c5f9] p-6">
					{clerkEnabled ? (
						<div className="space-y-4">
							{error ? <p className="text-sm text-red-600">{error}</p> : null}

							{step === "form" ? (
								<>
									<div>
										<label className="text-sm opacity-80">Prénom</label>
										<Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
									</div>
									<div>
										<label className="text-sm opacity-80">Nom</label>
										<Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
									</div>
									<div>
										<label className="text-sm opacity-80">Courriel</label>
										<Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
									</div>
									<div>
										<label className="text-sm opacity-80">Téléphone</label>
										<Input
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
											type="tel"
											placeholder="+1 555 555 5555"
										/>
										<p className="text-xs opacity-70 mt-1">Optionnel (selon config Clerk).</p>
									</div>
									<div>
										<label className="text-sm opacity-80">Mot de passe</label>
										<Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
										<p className="text-xs opacity-70 mt-1">Minimum 8 caractères.</p>
									</div>
								</>
							) : (
								<div>
									<label className="text-sm opacity-80">Code reçu par courriel</label>
									<Input value={emailCode} onChange={(e) => setEmailCode(e.target.value)} inputMode="numeric" />
									<p className="text-xs opacity-70 mt-1">Vérifie ta boîte courriel (et le spam).</p>
								</div>
							)}

							<Button onClick={() => handleSubmit().catch(() => undefined)} disabled={!canSubmit}>
								{pending ? "En cours…" : step === "form" ? "Créer le compte" : "Valider le code"}
							</Button>
						</div>
					) : (
						<div className="text-[#2d1b4e]">
							<p className="mb-2">L’authentification est désactivée.</p>
							<p className="text-sm opacity-80">
								Ajoute <code>VITE_CLERK_PUBLISHABLE_KEY</code> dans l’environnement pour activer l’inscription.
							</p>
						</div>
					)}
				</Card>
			</div>
		</main>
	);
}

