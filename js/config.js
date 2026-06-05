const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz4kjDksLCFPBHwjBdqKOezYPCTn6vN6Uvf29KLXcevlXIdER1otTN8-8goxbrCQKd5OQ/exec';

const CONFIG = {
  // En localhost usa el proxy PHP para evitar el bloqueo CORS.
  // En GitHub Pages usa la URL de Google Apps Script directamente.
  GOOGLE_SCRIPT_URL: window.location.hostname === 'localhost' ? 'api.php' : SCRIPT_URL,

  // WhatsApp de Adriana (formato internacional sin + ni espacios)
  WHATSAPP: '5491133102398',
};
