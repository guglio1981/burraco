/* ============================================================
   BURRACO — Vista pubblica dello stato, filtrata per giocatore.
   Il server NON invia mai lo stato completo: la mano e il pozzetto
   dell'avversario sono nascosti (solo conteggi). Anti-cheat.
   ============================================================ */
import type { Card, GameState, Seat, Mode, Phase, RoundResult } from './types.js';
import { otherSeat } from './types.js';

/** Durata del turno (ms) — usata anche dal timer server-side. */
export const TURN_MS = 60_000;

export interface PublicView {
  rev: number;
  phase: Phase;
  turn: Seat;
  mode: Mode;
  round: number;
  winner: Seat | null;
  turnStart: number;
  turnMs: number;
  lastRound: RoundResult | null;
  you: Seat;
  scores: Record<Seat, number>;
  deckCount: number;
  discard: Card[];
  myHand: Card[];
  myMelds: Card[][];
  myPozzoCount: number;
  myPozzoPicked: boolean;
  oppHandCount: number;
  oppMelds: Card[][];
  oppPozzoCount: number;
  oppPozzoPicked: boolean;
  /** Vincolo "scarta una carta diversa": valorizzato solo se è il tuo turno. */
  mustDiscardDifferentId: string | null;
}

/** Costruisce la vista per il giocatore `you` dallo stato autoritativo. */
export function buildView(state: GameState, you: Seat): PublicView {
  const opp = otherSeat(you);
  return {
    rev: state.rev,
    phase: state.phase,
    turn: state.turn,
    mode: state.mode,
    round: state.round,
    winner: state.winner,
    turnStart: state.turnStart,
    turnMs: TURN_MS,
    lastRound: state.lastRound,
    you,
    scores: state.scores,
    deckCount: state.deck.length,
    discard: state.discard,
    myHand: state.hands[you],
    myMelds: state.melds[you],
    myPozzoCount: state.pozzo[you].length,
    myPozzoPicked: state.pozzoPicked[you],
    oppHandCount: state.hands[opp].length,
    oppMelds: state.melds[opp],
    oppPozzoCount: state.pozzo[opp].length,
    oppPozzoPicked: state.pozzoPicked[opp],
    mustDiscardDifferentId: you === state.turn ? state.mustDiscardDifferentId : null,
  };
}
