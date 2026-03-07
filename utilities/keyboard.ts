import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { isNative, isIOS } from './platform';

export async function configureKeyboard(): Promise<void> {
  if (!isNative()) return;

  try {
    await Keyboard.setResizeMode({ mode: KeyboardResize.Ionic });
    if (isIOS()) {
      await Keyboard.setScroll({ isDisabled: true });
    }
  } catch {
    // Keyboard plugin not available
  }
}
