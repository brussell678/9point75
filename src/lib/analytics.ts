export const GA_MEASUREMENT_ID = "G-9YR652G6BX";

// Owner-only pages are never measured, so the shop's own logins don't count as visitors.
const PRIVATE_PATH = /^\/(admin|sign-in)(\/|$)/;

export function isPrivatePath(pathname: string) {
  return PRIVATE_PATH.test(pathname);
}

// Runs in <head> before the page hydrates, so gtag exists for any event fired later.
export const gaInitScript = `(function(){var id='${GA_MEASUREMENT_ID}';if(${PRIVATE_PATH}.test(location.pathname)){window['ga-disable-'+id]=true;}window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};window.gtag('js',new Date());window.gtag('config',id);})();`;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
