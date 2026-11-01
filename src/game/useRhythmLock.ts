import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FLASH_MS,
  PULSE_INTERVAL_MS,
  SECRET_HOTKEY,
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
      window.clearTimeout(flashTimer.current);
    },
    [],
  );

  const press = useCallback(() => {
    const now = performance.now();
    switch (modeRef.current) {
      case 'setup':
        // The press itself is beat zero; the hidden pulse starts here.
        lastTick.current = now;
        intervalId.current = window.setInterval(() => {
          lastTick.current = performance.now();
        }, PULSE_INTERVAL_MS);
        setStreak(0);
        setMode('game');
        break;
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

