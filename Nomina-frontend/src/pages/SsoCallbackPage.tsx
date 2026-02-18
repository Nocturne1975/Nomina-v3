import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

export function SsoCallbackPage() {
	return (
		<main className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-b from-violet-50 via-white to-pink-50">
			<div className="w-full max-w-[520px]">
				<h1 className="text-2xl font-semibold mb-2">Connexion…</h1>
				<p className="text-sm opacity-80 mb-4">Finalisation de l’authentification.</p>
				<AuthenticateWithRedirectCallback />
			</div>
		</main>
	);
}
