/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UNLOCK_CODE: string;
  readonly VITE_FINAL_CODE: string;
  readonly VITE_AUDIO_PATH: string;
  readonly VITE_TEMPO_PHRASE: string;
  readonly VITE_POS_POMME: string;
  readonly VITE_POS_BANANE: string;
  readonly VITE_POS_RAISIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}





