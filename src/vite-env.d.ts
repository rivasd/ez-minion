/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UNLOCK_CODE: string;
  readonly VITE_FINAL_CODE: string;
  readonly VITE_AUDIO_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
