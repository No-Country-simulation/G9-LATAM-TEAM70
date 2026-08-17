/**
 * Cliente HTTP centralizado para interactuar con los endpoints de Spring Boot
 */
export const API = {
  /**
   * Envía el texto a clasificar mediante POST a la API
   * @param {Object} payload Datos del contenido ({ title, content })
   * @returns {Promise<Object>} Respuesta parseada en JSON
   */
  async processContent(payload) {
    const endpoint = 'contenido';

    console.group('🌐 [API] Enviando petición a Spring Boot');
    console.log('Endpoint:', endpoint);
    console.log('Método: POST');
    console.log('Headers:', { 'Content-Type': 'application/json' });
    console.log('Payload (Body):', payload);
    console.groupEnd();

    const startTime = performance.now();

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const duration = (performance.now() - startTime).toFixed(2);
    const data = await response.json();

    console.group(`📥 [API] Respuesta recibida (${duration} ms)`);
    console.log('HTTP Status:', response.status, response.statusText);
    console.log('Data (Response Body):', data);
    console.groupEnd();

    if (!response.ok) {
      console.error('❌ [API] Error devuelto por la API:', data.message || 'Error desconocido');
      throw new Error(data.message || 'No se pudo procesar el contenido.');
    }

    return data;
  }
};