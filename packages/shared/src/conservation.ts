/* ============================================================
   BURRACO — Invariante di conservazione (spec §13)
   La somma di tutte le zone è SEMPRE 108, con id univoci e
   composizione del mazzo invariata. Validazione server anti-bug.
   ============================================================ */
import type { Card, GameState } from './types.js';
import { buildDeck } from './deck.js';

/** Tutte le carte presenti in ogni zona dello stato. */
export function allCards(state: GameState): Card[] {
  return [
    ...state.deck,
    ...state.discard,
    ...state.hands.host,
    ...state.hands.guest,
    ...state.pozzo.host,
    ...state.pozzo.guest,
    ...state.melds.host.flat(),
    ...state.melds.guest.flat(),
  ];
}

function compositionKey(cards: Card[]): string {
  const counts = new Map<string, number>();
  for (const c of cards) {
    const k = c.joker ? 'JK' : `${c.rank}${c.suit}`;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()].sort().map(([k, n]) => `${k}:${n}`).join('|');
}

const CANON = compositionKey(buildDeck());

export interface ConservationResult {
  ok: boolean;
  error?: string;
  total?: number;
}

/** Verifica l'invariante: 108 carte, id tutti distinti, composizione canonica. */
export function checkConservation(state: GameState): ConservationResult {
  const cards = allCards(state);
  if (cards.length !== 108) {
    return { ok: false, total: cards.length, error: `Conservazione: ${cards.length} carte invece di 108` };
  }
  const ids = new Set(cards.map((c) => c.id));
  if (ids.size !== 108) {
    return { ok: false, total: cards.length, error: 'Conservazione: id carta duplicato' };
  }
  if (compositionKey(cards) !== CANON) {
    return { ok: false, total: cards.length, error: 'Conservazione: composizione del mazzo alterata' };
  }
  return { ok: true, total: 108 };
}
