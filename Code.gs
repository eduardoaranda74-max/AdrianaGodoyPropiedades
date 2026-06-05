/**
 * API de Propiedades - Adriana Godoy
 *
 * INSTRUCCIONES:
 * 1. En tu Google Sheet, creá una hoja llamada exactamente "Propiedades"
 * 2. La primera fila debe tener estos encabezados (respetando mayúsculas y acentos):
 *    id | titulo | operacion | ubicacion | precio | dormitorios | baños | descripcion | imagen
 * 3. En "Extensiones" > "Apps Script", pegá este código
 * 4. Hacé clic en "Implementar" > "Nueva implementación"
 *    - Tipo: Aplicación web
 *    - Ejecutar como: Yo (tu cuenta)
 *    - Quién tiene acceso: Cualquier usuario
 * 5. Copiá la URL que te da y pegala en js/config.js en GOOGLE_SCRIPT_URL
 *
 * IMÁGENES DESDE EL CELULAR:
 * 1. Subí la foto a Google Drive desde tu celular
 * 2. Abrila y tocá los 3 puntos > "Compartir" > cambiá a "Cualquier persona con el enlace"
 * 3. Copiá el ID del archivo (la parte larga de la URL entre /d/ y /view)
 * 4. En la columna "imagen" de la planilla usá este formato:
 *    https://drive.google.com/uc?export=view&id=TU_ID_AQUI
 */
function doGet() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Propiedades');
  const datos = hoja.getDataRange().getValues();
  const encabezados = datos[0];
  const propiedades = [];

  for (let i = 1; i < datos.length; i++) {
    const fila = datos[i];
    if (!fila[0]) continue; // saltear filas vacías

    const prop = {};
    encabezados.forEach((col, j) => {
      prop[col] = fila[j];
    });
    propiedades.push(prop);
  }

  return ContentService
    .createTextOutput(JSON.stringify(propiedades))
    .setMimeType(ContentService.MimeType.JSON);
}
