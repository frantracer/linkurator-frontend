import {Theme, defaultTheme} from './themeConfig';

const STORAGE_KEY = 'theme';

export async function getUserTheme(): Promise<Theme> {
  if (typeof window === 'undefined') return defaultTheme;
  return (localStorage.getItem(STORAGE_KEY) as Theme) || defaultTheme;
}

export async function setUserTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
}
