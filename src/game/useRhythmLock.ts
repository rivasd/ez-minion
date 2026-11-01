import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FLASH_MS,
  PULSE_INTERVAL_MS,
  SECRET_HOTKEY,
  SETUP_MAX_GAP_MS,
  SETUP_TAPS,
  STREAK_TO_SOLVE,
  TOLERANCE_MS,
} from './config';

export type Mode = 'idle' | 'setup' | 'game' | 'solved';
export type Flash = 'none' | 'green';

export function useRhythmLock(toleranceMs = TOLERANCE_MS) {
  const [mode, setMode] = useState<Mode>('idle');
  const [streak, setStreak] = useState(0);
  const [flash, setFlash] = useState<Flash>('none');

  const lastTick = useRef(0);
  const intervalId = useRef<number | undefined>(undefined);
  const flashTimer = useRef<number | undefined>(undefined);
  const startTimer = useRef<number | undefined>(undefined);
  const setupTaps = useRef<number[]>([]);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  // Secret chord (keys held together, no modifiers so the browser can't intercept it)
  // -> setup mode. Only from idle, so it can't disturb a running game.
  useEffect(() => {
    const held = new Set<string>();
    const onDown = (e: KeyboardEvent) => {
      held.add(e.code);
      if (modeRef.current === 'idle' && SECRET_HOTKEY.every((k) => held.has(k))) {
        setMode('setup');
      }
    };
    const onUp = (e: KeyboardEvent) => held.delete(e.code);
    const onBlur = () => held.clear();
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  useEffect(
    () => () => {
      window.clearInterval(intervalId.current);
      window.clearTimeout(startTimer.current);
      window.clearTimeout(flashTimer.current);
    },
    [],
  );

  const press = useCallback(() => {
    const now = performance.now();
    switch (modeRef.current) {
      case 'setup': {
        // Tap along on the intended beat. A long pause means a fresh attempt.
        const taps = setupTaps.current;
        if (taps.length && now - taps[taps.length - 1] > SETUP_MAX_GAP_MS) taps.length = 0;
        taps.push(now);
        if (taps.length < SETUP_TAPS) break;

        // Taps are consecutive seconds of the clock: tap k lands on beat k, so each
        // one votes for a start time of (t_k - k * 1s). Average the votes.
        const P = PULSE_INTERVAL_MS;
        const phase = taps.reduce((sum, t, k) => sum + (t - k * P), 0) / taps.length;
        taps.length = 0;

        const beatsElapsed = Math.floor((now - phase) / P);
        lastTick.current = phase + beatsElapsed * P;
        const nextBeat = lastTick.current + P;
        startTimer.current = window.setTimeout(() => {
          lastTick.current = performance.now();
          intervalId.current = window.setInterval(() => {
            lastTick.current = performance.now();
          }, P);
        }, nextBeat - performance.now());
        setStreak(0);
        setMode('game');
        break;
      }
      case 'game': {
        const sinceTick = now - lastTick.current;
        const offBeat = Math.min(sinceTick, PULSE_INTERVAL_MS - sinceTick);
        if (offBeat <= toleranceMs) {
          window.clearTimeout(flashTimer.current);
          setFlash('green');
          flashTimer.current = window.setTimeout(() => setFlash('none'), FLASH_MS);
          setStreak((s) => {
            const next = s + 1;
            if (next >= STREAK_TO_SOLVE) {
              window.clearInterval(intervalId.current);
              window.clearTimeout(startTimer.current);
              setMode('solved');
            }
            return next;
          });
        } else {
          setStreak(0);
        }
        break;
      }
    }
  }, [toleranceMs]);

  return { mode, flash, streak, press };
}

