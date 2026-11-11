import { useSyncExternalStore } from 'react';

// Intro du logo : jouée une fois par visite, à l'ouverture de l'accueil.
// - « ready » : le site peut apparaître (le logo part vers la nav)
// - « landed » : le logo volant est posé, le vrai logo de la nav prend le relais
const KEY = 'intro-logo-vue';

function shouldPlay() {
  if (typeof window === 'undefined') return false;
  if (window.location.pathname !== '/' || window.location.hash) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return !sessionStorage.getItem(KEY);
  } catch {
    return true;
  }
}

export const INTRO_PLAYS = shouldPlay();

let state = { ready: !INTRO_PLAYS, landed: !INTRO_PLAYS };
const listeners = new Set<() => void>();

function set(next: Partial<typeof state>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

export function markIntroReady() {
  set({ ready: true });
}

export function markIntroLanded() {
  set({ ready: true, landed: true });
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    /* navigation privée : l'intro rejouera, ce n'est pas grave */
  }
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useIntro() {
  return useSyncExternalStore(subscribe, () => state);
}
