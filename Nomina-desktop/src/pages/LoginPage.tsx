import { SignIn } from "@clerk/clerk-react";
import { Card } from "../components/ui/card";

export function LoginPage() {
	const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

	return (
		<main className="min-h-screen p-6 flex items-start justify-center">
			<div className="w-full max-w-[480px]">
				<h1 className="text-3xl font-semibold mb-4">Connexion</h1>
				<Card className="bg-[#1a0f33] border-[#7b3ff2]/30 p-6">
					{clerkEnabled ? (
						<SignIn routing="hash" afterSignInUrl="#/dashboard" />
					) : (
						<div className="text-white/90">
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

