/// <reference types="vite/client" />
export {};

declare global {
  interface Window {
    bootstrap: {
      Offcanvas: {
        getInstance: (el: Element | null) => any;
        new (el: Element): { hide: () => void };
      };
    };
  }
}
