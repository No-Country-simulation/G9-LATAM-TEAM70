// js/app.js
console.log('⚡ [APP] Modulo app.js cargado correctamente.');

import { API } from './api.js';
import { UI } from './ui.js';

// Verificación de seguridad para asegurar que el DOM localizó el formulario
if (!UI.elements.form) {
  console.error('❌ [APP] No se encontró el elemento #content-form en el DOM.');
} else {
  UI.elements.form.addEventListener('submit', async (event) => {
    // IMPORTANTE: preventDefault debe ser la PRIMERA línea
    event.preventDefault();

    console.group('🚀 [APP] Evento submit capturado exitosamente');
    
    const payload = UI.getFormData();
    console.log('Datos del formulario capturados:', payload);

    UI.showLoading();

    try {
      const responseData = await API.processContent(payload);
      console.log('Respuesta recibida exitosamente:', responseData);
      UI.showSuccess(responseData);
    } catch (error) {
      console.warn('Error durante el procesamiento:', error.message);
      UI.showError(error.message);
    } finally {
      UI.hideLoading();
      console.groupEnd();
    }
  });
}