/// <reference types="react-scripts" />

interface ImportMetaEnv {
  readonly VITE_HUGGINGFACE_API_TOKEN?: string;
  readonly VITE_GOOGLE_VISION_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}