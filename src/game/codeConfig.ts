export const UNLOCK_CODE = import.meta.env.VITE_UNLOCK_CODE ?? '000';
export const FINAL_CODE = import.meta.env.VITE_FINAL_CODE ?? '000';
export const AUDIO_URL = `${import.meta.env.BASE_URL}${
  import.meta.env.VITE_AUDIO_PATH ?? 'audio/minions.mp3'
}`;

/** In order. Compared case-insensitively, ignoring surrounding whitespace. */
export const ANSWERS = ['madagascar', 'lave', 'Phil', 'windows xp'];

export const normalize = (s: string) => s.trim().toLowerCase();


/** Room photo: public/photos/room.jpg, with its expected answer and the clue revealed on success. */
export const PHOTO_SRC = `${import.meta.env.BASE_URL}photos/room.jpg`;
export const PHOTO_ANSWERS = [
  import.meta.env.VITE_PHOTO_ANSWER_1,
  import.meta.env.VITE_PHOTO_ANSWER_2,
  import.meta.env.VITE_PHOTO_ANSWER_3,
].map((a) => a ?? '');
export const PHOTO_CLUE = import.meta.env.VITE_PHOTO_CLUE ?? '';

