export {};

declare global {
  interface Window {
    env: {
      REACT_APP_API_BASE_URL: string;
    };
  }
}
