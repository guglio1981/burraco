import { describe, it, expect } from 'vitest';
import { burracoType, isBurraco } from '../src/index.js';
import { C, J } from './helpers.js';

const seq = (suit: Parameters<typeof C>[1], ranks: Parameters<typeof C>[0][]) =>
  ranks.map((r) => C(r, suit));

describe('burracoType', () => {
  it('non è burraco sotto le 7 carte', () => {
    expect(isBurraco(seq('♠', ['3', '4', '5', '6', '7', '8']))).toBe(false);
    expect(burracoType(seq('♠', ['3', '4', '5', '6', '7', '8']))).toBeNull();
  });

  it('pulito: sequenza di 7+ senza matte', () => {
    expect(burracoType(seq('♠', ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']))).toBe('clean');
  });

  it('pulito: un 2 naturale non sporca', () => {
    expect(burracoType(seq('♥', ['A', '2', '3', '4', '5', '6', '7']))).toBe('clean');
  });

  it('semipulito: sequenza di 7 con 1 jolly', () => {
    expect(burracoType([C('8', '♣'), C('9', '♣'), C('10', '♣'), J(), C('Q', '♣'), C('K', '♣'), C('A', '♣')])).toBe('semi');
  });

  it('semipulito: pinella-wild in sequenza di 7', () => {
    expect(burracoType([C('3', '♥'), C('4', '♥'), C('5', '♥'), C('2', '♠'), C('7', '♥'), C('8', '♥'), C('9', '♥')])).toBe('semi');
  });

  it('sporco: tris di 7 con 1 jolly (6 naturali)', () => {
    expect(burracoType([C('Q', '♥'), C('Q', '♦'), C('Q', '♠'), J(), C('Q', '♣'), C('Q', '♥'), C('Q', '♦')])).toBe('dirty');
  });

  it('pulito: tris di 7 stesso rango senza matte', () => {
    expect(burracoType([C('Q', '♥'), C('Q', '♦'), C('Q', '♠'), C('Q', '♣'), C('Q', '♥'), C('Q', '♦'), C('Q', '♠')])).toBe('clean');
  });

  it('semipulito: tris di 8 con 1 jolly (7 naturali)', () => {
    expect(burracoType([C('Q', '♥'), C('Q', '♦'), C('Q', '♠'), C('Q', '♣'), C('Q', '♥'), C('Q', '♦'), C('Q', '♠'), J()])).toBe('semi');
  });
});
