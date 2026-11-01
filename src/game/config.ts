export const PULSE_INTERVAL_MS = 1000;
/** A click counts as "on beat" if within this many ms either side of a pulse. */
export const TOLERANCE_MS = 100;
export const STREAK_TO_SOLVE = 10;
export const FLASH_MS = 250;
export const SECRET_PHRASE = import.meta.env.VITE_TEMPO_PHRASE ?? '';

/** Secret chord: hold all of these keys at once (KeyboardEvent.code) to enter setup mode. */
export const SECRET_HOTKEY = ['KeyE', 'KeyS', 'KeyC'];



/** Setup mode: number of taps averaged to find the pulse phase. */
export const SETUP_TAPS = 3;
/** A pause longer than this between setup taps restarts the count. */
export const SETUP_MAX_GAP_MS = 2500;
