import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from "react-router-dom";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Missing #root element')
}

function MissingEnv() {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Configuration incomplète</h1>
      <p style={{ marginBottom: 8 }}>
        La variable <code>VITE_CLERK_PUBLISHABLE_KEY</code> est manquante. En production (Vercel),
        ajoute-la dans <strong>Settings → Environment Variables</strong> puis redeploie.
      </p>
      <p style={{ opacity: 0.8 }}>
        (Ce message évite une page blanche; ouvre la console pour plus de détails.)
      </p>
    </div>
  )
}

const root = ReactDOM.createRoot(rootEl)

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

if (!PUBLISHABLE_KEY) {
  // Ne bloque pas l'app: on affiche quand même l'accueil en mode “sans auth”.
  console.warn('Missing VITE_CLERK_PUBLISHABLE_KEY — auth disabled')
  root.render(
    <React.StrictMode>
      {app}
    </React.StrictMode>
  )
} else {
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        {app}
      </ClerkProvider>
    </React.StrictMode>
  )
}