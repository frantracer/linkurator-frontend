import { Browser } from '@capacitor/browser';
import { isNative } from './platform';

export async function openExternalLink(url: string): Promise<void> {
  if (isNative()) {
    await Browser.open({ url });
  } else {
    window.open(url, '_blank');
  }
}
