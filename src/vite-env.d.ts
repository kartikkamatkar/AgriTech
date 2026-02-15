/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEATHER_API_KEY: string
  readonly VITE_DEFAULT_CITY: string
  readonly VITE_AUTO_REFRESH_INTERVAL: string
  readonly VITE_MARKET_API_URL?: string
  readonly VITE_MARKET_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
