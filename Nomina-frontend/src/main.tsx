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