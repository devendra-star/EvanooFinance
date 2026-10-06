declare module 'react-native-config' {
  export interface NativeConfig {
    ENVIRONMENT: 'development' | 'production';
    APP_NAME: string;
    VERSION_CODE: string;
    VERSION_NAME: string;
    ASYNC_STORAGE_DB_NAME: string;
    ACCESS_TOKEN_STORAGE_KEY: string;
    REFRESH_TOKEN_STORAGE_KEY: string;
    USER_DATA_STORAGE_KEY: string;
    API_URL: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
