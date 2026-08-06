import { API } from './api.js';
import { UI } from './ui.js';

// Escuchar el envío del formulario
UI.elements.form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Previene la recarga nativa de la página

  // 1. Obtener payload desde el formulario ({ title, content })
  const payload = UI.getFormData();

  // 2. Activar estado visual de carga
  UI.showLoading();

  try {
    // 3. Petición POST a /contenido
    const responseData = await API.processContent(payload);

    // 4. Mostrar respuesta
    UI.showSuccess(responseData);
  } catch (error) {
    // 5. Manejar errores de la API o red
    UI.showError(error.message);
  } finally {
    // 6. Restablecer el botón
    UI.hideLoading();
  }
});