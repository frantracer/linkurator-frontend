import "./styles.css";
import "tailwindcss/tailwind.css";

import ReactQueryProvider from "../providers/ReactQueryProvider";
import { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Linkurator',
  description: 'Linkurator es un agregador de contenidos audiovisuales que organiza tus suscripciones en categorías. Comparte categorías, recomienda contenidos y conviértete en un curador para compartir tus gustos con el mundo',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
    shortcut: '/icon.png',
  },
}

export default async function RootLayout(
  {
    children,
  }: {
    children: React.ReactNode
  }) {
  const messages = await getMessages();

  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-title" content="Linkurator" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
