import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { SignIn, SignUp, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import logoUrl from "../../assets/logo5.png";

export function Header() {
  const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  return (
    <header className="sticky top-0 z-50 bg-[#2d1b4e] border-b border-[#7b3ff2]/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#/"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8b4f0]/60 rounded-lg"
            aria-label="Aller à l’accueil"
          >
            <div className="w-14 h-14 bg-[#2d1b4e] rounded-lg flex items-center justify-center"> 
              <img src={logoUrl} alt="Nomina" className="w-11 h-11 object-contain" draggable={false} />
            </div>
            <span className="text-2xl text-white" style={{ fontFamily: 'Cinzel, serif' }}>
              Nomina
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#/features" className="text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
              Fonctionnalités
            </a>
            <a href="#/usecases" className="text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
              Cas d'usage
            </a>
            <a href="#/pricing" className="text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
              Tarifs
            </a>
            {clerkEnabled ? (
              <SignedIn>
                <a href="#/dashboard" className="text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                  Dashboard
                </a>
                <a href="#/cultures" className="text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                  Cultures
                </a>
              </SignedIn>
            ) : null}
            <a href="#/generate" className="text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
              Génération
            </a>
            <a href="#/docs" className="text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
              Documentation
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {clerkEnabled ? (
              <>
                <SignedOut>
                  <Button
                    variant="ghost"
                    className="text-[#d4c5f9] hover:text-white hover:bg-[#7b3ff2]/20"
                    onClick={() => {
                      setAuthMode('signin');
                      setAuthOpen(true);
                    }}
                  >
                    Connexion
                  </Button>
                  <Button
                    className="bg-[#7b3ff2] hover:bg-[#a67be8] text-white"
                    onClick={() => {
                      setAuthMode('signup');
                      setAuthOpen(true);
                    }}
                  >
                    Commencer
                  </Button>
                </SignedOut>
                <SignedIn>
                  <UserButton
                    afterSignOutUrl="#/"
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9",
                      },
                    }}
                  />
                </SignedIn>
              </>
            ) : (
              <div className="text-sm text-[#d4c5f9] opacity-80">
                Auth désactivée (clé Clerk manquante)
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#7b3ff2]/20">
            <nav className="flex flex-col gap-4">
              <a href="#/features" className="text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                Fonctionnalités
              </a>
              <a href="#/usecases" className="text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                Cas d'usage
              </a>
              <a href="#/pricing" className="text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                Tarifs
              </a>
              {clerkEnabled ? (
                <SignedIn>
                  <a href="#/dashboard" className="text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                    Dashboard
                  </a>
                  <a href="#/cultures" className="text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                    Cultures
                  </a>
                </SignedIn>
              ) : null}
              <a href="#/generate" className="text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                Génération
              </a>
              <a href="#/docs" className="text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                Documentation
              </a>
              <div className="flex flex-col gap-2 pt-2">
                {clerkEnabled ? (
                  <>
                    <SignedOut>
                      <Button
                        variant="outline"
                        className="border-[#7b3ff2] text-[#d4c5f9]"
                        onClick={() => {
                          setAuthMode('signin');
                          setAuthOpen(true);
                        }}
                      >
                        Connexion
                      </Button>
                      <Button
                        className="bg-[#7b3ff2] hover:bg-[#a67be8] text-white"
                        onClick={() => {
                          setAuthMode('signup');
                          setAuthOpen(true);
                        }}
                      >
                        Commencer
                      </Button>
                    </SignedOut>
                    <SignedIn>
                      <div className="flex justify-center py-2">
                        <UserButton
                          afterSignOutUrl="#/"
                          appearance={{
                            elements: {
                              avatarBox: "w-9 h-9",
                            },
                          }}
                        />
                      </div>
                    </SignedIn>
                  </>
                ) : (
                  <div className="text-sm text-[#d4c5f9] opacity-80">
                    Auth désactivée (clé Clerk manquante)
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {clerkEnabled ? (
        <Dialog open={authOpen} onOpenChange={setAuthOpen}>
          <DialogContent className="max-w-[460px] bg-[#1a0f33] border-[#7b3ff2]/30">
            <DialogHeader>
              <DialogTitle className="text-white">
                {authMode === 'signin' ? 'Connexion' : 'Créer un compte'}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-2">
              {authMode === 'signin' ? (
                <SignIn routing="hash" afterSignInUrl="#/dashboard" />
              ) : (
                <SignUp routing="hash" afterSignUpUrl="#/dashboard" />
              )}
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </header>
  );
}
