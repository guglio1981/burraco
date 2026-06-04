/* ============================================================
   Gestione dei timer di turno (setTimeout per stanza).
   ============================================================ */
export class TurnTimers {
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  /** Arma (o ri-arma) il timer per una stanza. */
  arm(roomId: string, delayMs: number, cb: () => void): void {
    this.clear(roomId);
    const t = setTimeout(() => {
      this.timers.delete(roomId);
      cb();
    }, Math.max(0, delayMs));
    this.timers.set(roomId, t);
  }

  clear(roomId: string): void {
    const t = this.timers.get(roomId);
    if (t) {
      clearTimeout(t);
      this.timers.delete(roomId);
    }
  }
}
