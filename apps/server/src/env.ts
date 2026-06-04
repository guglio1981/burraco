/* Carica le variabili d'ambiente da .env (cartella server) e dalla root del monorepo. */
import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

for (const p of ['.env', resolve(process.cwd(), '../../.env')]) {
  if (existsSync(p)) dotenv.config({ path: p });
}

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Variabile d'ambiente mancante: ${name}`);
  return v;
}

export const ENV = {
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? 'dev-insecure-secret-change-me',
  PORT: Number(process.env.PORT ?? 8787),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  VAPID_PUBLIC_KEY:  process.env.VAPID_PUBLIC_KEY  ?? '',
  VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY ?? '',
  VAPID_EMAIL:       process.env.VAPID_EMAIL        ?? '',
  requireDb(): string {
    return required('DATABASE_URL');
  },
};
