import { getRequestConfig } from 'next-intl/server';
import { Locale, defaultLocale, locales } from './config';

export default getRequestConfig(async () => {
  let locale: Locale = defaultLocale;
  try {
    const { cookies } = await import('next/headers');
    const cookieValue = (await cookies()).get('locale')?.value;
    if (cookieValue && locales.includes(cookieValue as Locale)) {
      locale = cookieValue as Locale;
    }
  } catch {
    // Static export or no cookies available
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
