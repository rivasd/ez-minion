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

/**
 * Digits revealed when holding a square of the chessboard.
 * 8 rows of 8, written as the board looks on screen: row 0 is the top row,
 * column 0 the left. Use null for a square that reveals nothing.
 */
export const BOARD_DIGITS: (number | null)[][] = [
  [3, 7, 1, 9, 4, 0, 6, 2],
  [8, 5, 2, 6, 1, 7, 3, 9],
  [0, 4, 9, 3, 8, 5, 1, 7],
  [6, 1, 7, 2, 9, 4, 8, 0],
  [2, 9, 5, 8, 3, 1, 7, 4],
  [7, 3, 0, 4, 6, 9, 2, 5],
  [1, 8, 4, 7, 5, 2, 9, 3],
  [9, 6, 3, 0, 2, 8, 4, 1],
];
