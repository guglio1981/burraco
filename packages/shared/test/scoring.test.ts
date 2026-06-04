import { describe, it, expect } from 'vitest';
import { cardPts, calcMeldPts, meldCardPoints, handPenalty, isMatchOver } from '../src/index.js';
import { C, J } from './helpers.js';

describe('cardPts', () => {
  it('valori chiave', () => {
    expect(cardPts(C('A', '♠'))).toBe(15);
    expect(cardPts(C('2', '♠'))).toBe(20);
    expect(cardPts(C('K', '♠'))).toBe(10);
    expect(cardPts(C('7', '♠'))).toBe(5);
    expect(cardPts(J())).toBe(30);
  });
});

describe('calcMeldPts', () => {
  it('tris semplice = solo carte (non è burraco)', () => {
    expect(calcMeldPts([C('7', '♠'), C('7', '♥'), C('7', '♦')])).toBe(15);
  });
  it('burraco pulito = carte + 200', () => {
    const m = [C('A', '♥'), C('2', '♥'), C('3', '♥'), C('4', '♥'), C('5', '♥'), C('6', '♥'), C('7', '♥')];
    expect(meldCardPoints(m)).toBe(15 + 20 + 5 + 5 + 5 + 5 + 5);
    expect(calcMeldPts(m)).toBe(60 + 200);
  });
});

describe('handPenalty', () => {
  it('somma i punti delle carte in mano', () => {
    expect(handPenalty([C('A', '♠'), C('K', '♥'), C('3', '♦')])).toBe(15 + 10 + 5);
  });
});

describe('isMatchOver', () => {
  it('1005: vero al raggiungimento', () => {
    expect(isMatchOver(1005, 400, '1005')).toBe(true);
    expect(isMatchOver(900, 400, '1005')).toBe(false);
  });
  it('2005: soglia più alta', () => {
    expect(isMatchOver(1500, 1500, '2005')).toBe(false);
    expect(isMatchOver(2010, 100, '2005')).toBe(true);
  });
  it('veloce: sempre finita dopo una manche', () => {
    expect(isMatchOver(10, 5, 'fast')).toBe(true);
  });
});
