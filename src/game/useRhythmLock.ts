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

  const beatAnchor = useRef(0);
  const flashTimer = useRef<number | undefined>(undefined);
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
    () => () => window.clearTimeout(flashTimer.current),
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

        beatAnchor.current = phase;
        setStreak(0);
        setMode('game');
        break;
      }
      case 'game': {
        // Beats are phase + k * 1s on the monotonic clock. Computing them, rather than
        // timestamping setInterval callbacks, means timer lateness can never accumulate.
        const sinceBeat = (((now - beatAnchor.current) % PULSE_INTERVAL_MS) + PULSE_INTERVAL_MS) % PULSE_INTERVAL_MS;
        const offBeat = Math.min(sinceBeat, PULSE_INTERVAL_MS - sinceBeat);
        if (offBeat <= toleranceMs) {
          window.clearTimeout(flashTimer.current);
          setFlash('green');
          flashTimer.current = window.setTimeout(() => setFlash('none'), FLASH_MS);
          setStreak((s) => {
            const next = s + 1;
            if (next >= STREAK_TO_SOLVE) {
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

