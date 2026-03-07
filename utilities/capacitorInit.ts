import { isNative } from './platform';
import { configureStatusBar } from './statusBar';
import { configureKeyboard } from './keyboard';
import { defaultTheme, Theme } from './themeConfig';

export async function initCapacitor(): Promise<void> {
  if (!isNative()) return;

  const theme = (localStorage.getItem('theme') as Theme) || defaultTheme;
  await configureStatusBar(theme === Theme.DARK);
  await configureKeyboard();
}
