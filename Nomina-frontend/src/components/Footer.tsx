import { Twitter, Github, Linkedin } from "lucide-react";

import logoUrl from "../../assets/logo5.png";

export function Footer() {
  return (
    <footer className="bg-[#2d1b4e] border-t border-[#7b3ff2]/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <a
              href="#/"
              className="inline-flex items-center gap-3 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8b4f0]/60 rounded-lg"
              aria-label="Aller à l’accueil"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#7b3ff2] to-[#a67be8] rounded-lg flex items-center justify-center">
                <img src={logoUrl} alt="Nomina" className="w-7 h-7 object-contain" draggable={false} />
              </div>
              <span className="text-2xl text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                Nomina
              </span>
            </a>
            <p className="text-sm text-[#d4c5f9]">
              Créez, Nommez, Racontez avec l'API de génération narrative
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white mb-4">Produit</h4>
            <ul className="space-y-2">
              <li>
                <a href="#/features" className="text-sm text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#/pricing" className="text-sm text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                  Tarifs
                </a>
              </li>
              <li>
                <a href="#/docs" className="text-sm text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#/changelog" className="text-sm text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white mb-4">Ressources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#/blog" className="text-sm text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#/guides" className="text-sm text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                  Guides
                </a>
              </li>
              <li>
                <a href="#/community" className="text-sm text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                  Communauté
                </a>
              </li>
              <li>
                <a href="#/support" className="text-sm text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white mb-4">Entreprise</h4>
            <ul className="space-y-2">
              <li>
                <a href="#/about" className="text-sm text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#/careers" className="text-sm text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                  Carrières
                </a>
              </li>
              <li>
                <a href="#/contact" className="text-sm text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#/privacy" className="text-sm text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
                  Confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#7b3ff2]/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#c5bfd9]">
            © 2025 Nomina. Tous droits réservés.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="#/twitter" className="text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#/github" className="text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#/linkedin" className="text-[#d4c5f9] hover:text-[#e8b4f0] transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
