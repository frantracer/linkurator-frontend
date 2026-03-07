import { Capacitor } from '@capacitor/core';

export type Platform = 'web' | 'ios' | 'android';

export function getPlatform(): Platform {
  if (typeof window === 'undefined') return 'web';
  try {
    const platform = Capacitor.getPlatform();
    if (platform === 'ios') return 'ios';
    if (platform === 'android') return 'android';
    return 'web';
  } catch {
    return 'web';
  }
}

export function isNative(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export function isIOS(): boolean {
  return getPlatform() === 'ios';
}

export function isAndroid(): boolean {
  return getPlatform() === 'android';
}
