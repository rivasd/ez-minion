export const UNLOCK_CODE = import.meta.env.VITE_UNLOCK_CODE ?? '000';
export const FINAL_CODE = import.meta.env.VITE_FINAL_CODE ?? '000';
export const AUDIO_URL = `${import.meta.env.BASE_URL}${
  import.meta.env.VITE_AUDIO_PATH ?? 'audio/loop.mp3'
}`;

/** In order. Compared case-insensitively, ignoring surrounding whitespace. */
export const ANSWERS = ['madagascar', 'lave', 'Phil', 'windows xp'];

export const normalize = (s: string) => s.trim().toLowerCase();
