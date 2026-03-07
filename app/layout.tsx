import "./styles.css";
import "tailwindcss/tailwind.css";

import ReactQueryProvider from "../providers/ReactQueryProvider";
import { Metadata } from "next";
import IntlProvider from "../providers/IntlProvider";
import { Analytics } from '@vercel/analytics/next';
import { ToastProvider } from '../contexts/ToastContext';

export const metadata: Metadata = {
  title: 'Linkurator',
  description: 'Linkurator es un agregador de contenidos audiovisuales que organiza tus suscripciones en categorías. Comparte categorías, recomienda contenidos y conviértete en un curador para compartir tus gustos con el mundo',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
    shortcut: '/icon.png',
  },
}

export default function RootLayout(
  {
    children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <html lang="es" className={"scroll-smooth"} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-title" content="Linkurator" />
        <title>Linkurator</title>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var theme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', theme);
          })();
        `}} />
      </head>
      <body>
        <IntlProvider>
          <ReactQueryProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ReactQueryProvider>
        </IntlProvider>
        <Analytics />
      </body>
    </html>
  )
}
