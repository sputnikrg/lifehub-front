import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// 👉 ДОБАВЛЕНО (1 строка)
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 👉 ДОБАВЛЕНО (обёртка, ничего не удаляли) */}
    <HelmetProvider>
      <PayPalScriptProvider
        options={{
          "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
          currency: "EUR",
          intent: "capture",
        }}
      >
        <App />
      </PayPalScriptProvider>
    </HelmetProvider>
  </StrictMode>
)
