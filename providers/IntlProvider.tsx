'use client';

import {NextIntlClientProvider} from 'next-intl';
import {useState, useEffect} from 'react';
import {Locale, defaultLocale, locales} from '../i18n/config';
import {initCapacitor} from '../utilities/capacitorInit';

export default function IntlProvider({children}: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('locale');
    const storedLocale: Locale = stored && locales.includes(stored as Locale) ? stored as Locale : defaultLocale;
    setLocale(storedLocale);
    import(`../messages/${storedLocale}.json`).then((mod) => {
      setMessages(mod.default);
    });
    initCapacitor();
  }, []);

  if (!messages) return null;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
