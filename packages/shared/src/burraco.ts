/* ============================================================
   BURRACO — Classificazione burraco: pulito / semi / sporco (spec §7)
   ============================================================ */
import type { Card, BurracoType } from './types.js';
import { meldInterpretations } from './meld.js';

/** Un burraco è una scala di ≥7 carte. */
export function isBurraco(cards: Card[]): boolean {
  return cards.length >= 7;
}

/**
 * Classifica un burraco. Ritorna null se non è ≥7 o non è una scala valida.
 * - clean: esiste un'interpretazione valida con 0 matte (nessun jolly, tutti i 2 naturali).
 * - semi:  esiste un'interpretazione con esattamente 1 matta e corsa/tris effettiva ≥7.
 *          (sequenza con 1 matta e ≥7 carte → lo span coperto è ≥7 → semi;
 *           tris con 1 matta → semi solo se i naturali sono ≥7.)
 * - dirty: è un burraco valido ma né clean né semi.
 */
export function burracoType(cards: Card[]): BurracoType | null {
  if (!isBurraco(cards)) return null;
  const interps = meldInterpretations(cards);
  if (interps.length === 0) return null;
  if (interps.some((i) => i.wilds === 0)) return 'clean';
  const semi = interps.some(
    (i) => i.wilds === 1 && (i.kind === 'seq' ? true : i.naturals >= 7),
  );
  return semi ? 'semi' : 'dirty';
}

export const isBurracoClean = (cards: Card[]): boolean => burracoType(cards) === 'clean';
export const isBurracoSemi = (cards: Card[]): boolean => burracoType(cards) === 'semi';
