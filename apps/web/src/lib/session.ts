/* Token JWT in localStorage + deep-link ?join=CODE */

const TOKEN_KEY = 'burraco_token';
const PENDING_KEY = 'burraco_pending_join';

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string): void => { localStorage.setItem(TOKEN_KEY, t); };
export const clearToken = (): void => { localStorage.removeItem(TOKEN_KEY); };

export const getPendingJoin = (): string | null => sessionStorage.getItem(PENDING_KEY);
export const setPendingJoin = (code: string): void => { sessionStorage.setItem(PENDING_KEY, code); };
export const clearPendingJoin = (): void => { sessionStorage.removeItem(PENDING_KEY); };

/** Legge `?join=CODE` dalla URL corrente e pulisce la URL. Ritorna il codice o null. */
export function consumeJoinCode(): string | null {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('join');
  if (code) {
    url.searchParams.delete('join');
    history.replaceState(null, '', url.toString());
    return code.trim().toUpperCase();
  }
  return null;
}
