import { StatusBar, Style } from '@capacitor/status-bar';
import { isNative } from './platform';

export async function configureStatusBar(isDarkTheme: boolean): Promise<void> {
  if (!isNative()) return;

  try {
    await StatusBar.setStyle({
      style: isDarkTheme ? Style.Dark : Style.Light,
    });
    await StatusBar.setOverlaysWebView({ overlay: true });
  } catch {
    // StatusBar plugin not available
  }
}
