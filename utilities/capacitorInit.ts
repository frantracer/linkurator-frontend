import axios from 'axios';
import { isNative } from './platform';
import { configureStatusBar } from './statusBar';
import { configureKeyboard } from './keyboard';
import { defaultTheme, Theme } from './themeConfig';
import { getAuthToken } from './authToken';

export async function initCapacitor(): Promise<void> {
  if (!isNative()) return;

  const theme = (localStorage.getItem('theme') as Theme) || defaultTheme;
  await configureStatusBar(theme === Theme.DARK);
  await configureKeyboard();
  setupAxiosAuthInterceptor();
}

function setupAxiosAuthInterceptor(): void {
  axios.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });
}
