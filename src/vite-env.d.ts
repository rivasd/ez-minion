/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UNLOCK_CODE: string;
  readonly VITE_FINAL_CODE: string;
  readonly VITE_AUDIO_PATH: string;
  readonly VITE_TEMPO_PHRASE: string;
  readonly VITE_PHOTO_ANSWER_1: string;
  readonly VITE_PHOTO_ANSWER_2: string;
  readonly VITE_PHOTO_ANSWER_3: string;
  readonly VITE_PHOTO_CLUE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}





