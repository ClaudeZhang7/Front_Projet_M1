export const environment = {
    production: true,
    // correspond a l'url de notre api elle doit être caché !
    // l'url sera donné à travers les configs fait sur netlify.
    apiUrl: typeof window !== 'undefined' && (window as any).NG_APP_API_URL 
    ? (window as any).NG_APP_API_URL 
    : ''

  };
