import { isNative } from './platform';

const TOKEN_KEY = 'auth_token';

export function storeAuthToken(token: string): void {
  if (isNative()) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getAuthToken(): string | null {
  if (isNative()) {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
