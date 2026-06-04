import type { Card, Rank, Suit } from '../src/index.js';

let _id = 0;
/** Carta naturale per i test. */
export const C = (rank: Rank, suit: Suit): Card => ({ id: `t${_id++}`, rank, suit, joker: false });
/** Jolly per i test. */
export const J = (): Card => ({ id: `t${_id++}`, rank: 'JK', suit: '★', joker: true });
export const ids = (cards: Card[]): string[] => cards.map((c) => c.id);
