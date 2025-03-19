export const environment = {
    production: true,
    // correspond a l'url de notre api elle doit être caché !
    // l'url sera donné à travers les configs fait sur netlify.
    apiUrl: process.env['NG_APP_API_URL'] || ''
  };
