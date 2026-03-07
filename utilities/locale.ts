import {Locale, defaultLocale} from '../i18n/config';

const STORAGE_KEY = 'locale';

export async function getUserLocale(): Promise<string> {
  if (typeof window === 'undefined') return defaultLocale;
  return localStorage.getItem(STORAGE_KEY) || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, locale);
  window.location.reload();
}
