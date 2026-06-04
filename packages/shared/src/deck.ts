/* ============================================================
   BURRACO — Mazzo, mescolamento, distribuzione (spec §1, §2)
   ============================================================ */
import type { Card, Rank, Suit, Seat } from './types.js';

const SUITS: Suit[] = ['♠', '♣', '♥', '♦'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/** Costruisce il mazzo completo di 108 carte (2 mazzi francesi + 4 jolly),
 *  ogni carta con un id univoco `c0..c107`. */
export function buildDeck(): Card[] {
  const cards: Card[] = [];
  let n = 0;
  for (let d = 0; d < 2; d++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        cards.push({ id: `c${n++}`, rank, suit, joker: false });
      }
    }
    // 2 jolly per mazzo
    cards.push({ id: `c${n++}`, rank: 'JK', suit: '★', joker: true });
    cards.push({ id: `c${n++}`, rank: 'JK', suit: '★', joker: true });
  }
  return cards; // 104 + 4 = 108
}

export type Rng = () => number; // [0,1)

/** Fisher-Yates. Restituisce una NUOVA lista mescolata (non muta l'input). */
export function shuffle<T>(arr: readonly T[], rng: Rng = Math.random): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

/** PRNG deterministico (mulberry32) per test riproducibili. */
export function seededRng(seed: number): Rng {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export interface DealResult {
  deck: Card[];
  discard: Card[];
  hands: Record<Seat, Card[]>;
  pozzo: Record<Seat, Card[]>;
}

/** Distribuisce un mazzo di 108 carte: 11 mano + 11 pozzetto a testa,
 *  1 scarto iniziale, 63 di tallone. Somma = 108 (spec §2). */
export function deal(rng: Rng = Math.random): DealResult {
  const d = shuffle(buildDeck(), rng);
  let i = 0;
  const take = (k: number): Card[] => d.slice(i, (i += k));
  const handHost = take(11);
  const handGuest = take(11);
  const pozzoHost = take(11);
  const pozzoGuest = take(11);
  const discard = take(1);
  const deck = d.slice(i); // restanti 63
  return {
    deck,
    discard,
    hands: { host: handHost, guest: handGuest },
    pozzo: { host: pozzoHost, guest: pozzoGuest },
  };
}
