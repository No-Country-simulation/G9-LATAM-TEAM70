/**
 * Manipulación del DOM y estado visual de la UI
 */
export const UI = {
  elements: {
    form: document.querySelector('#content-form'),
    titleInput: document.querySelector('#title'),
    contentInput: document.querySelector('#content'),
    submitBtn: document.querySelector('#submit'),
    btnText: document.querySelector('#btn-text'),
    spinner: document.querySelector('#loading-spinner'),
    resultSection: document.querySelector('#result')
  },

  /**
   * Obtiene los datos del formulario
   */
  getFormData() {
    const data = {
      title: this.elements.titleInput.value.trim(),
      content: this.elements.contentInput.value.trim()
    };
    console.log('🎨 [UI] Extrayendo datos de inputs:', data);
    return data;
  },

  /**
   * Activa la animación de carga en el botón
   */
  showLoading() {
    console.log('🎨 [UI] Mostrando spinner SVG y deshabilitando botón');
    this.elements.submitBtn.disabled = true;
    this.elements.spinner.style.display = 'inline-block';
    this.elements.btnText.textContent = 'Procesando...';
    this.elements.resultSection.style.display = 'none';
  },

  /**
   * Renderiza el resultado en pantalla y lanza un alert con la respuesta del backend
   * @param {Object} data Objeto ContentResponse del backend
   */
  showSuccess(data) {
    console.log('🎨 [UI] Actualizando interfaz con datos del backend:', data);
    const confidence = data.score ? (data.score * 100).toFixed(0) : 'N/A';
    const keywords = Array.isArray(data.keywords) ? data.keywords.join(', ') : 'Ninguna';

    // 1. Mostrar la respuesta en una ventana de alerta
    alert(`Respuesta del Backend:\n\nCategoría: ${data.category}\nConfianza: ${confidence}%\nPalabras clave: ${keywords}\nModelo: ${data.modelUsed}`);

    // 2. Renderizado en el bloque HTML del resultado
    this.elements.resultSection.className = '';
    this.elements.resultSection.style.display = 'block';
    this.elements.resultSection.innerHTML = `
      <strong>Categoría:</strong> ${data.category || 'Sin categoría'}<br>
      <strong>Confianza:</strong> ${confidence}%<br>
      <strong>Palabras clave:</strong> ${keywords}<br>
      <small>Modelo: ${data.modelUsed || 'TechMind Engine'}</small>
    `;
  },

  /**
   * Muestra mensaje de error tanto en alert como en la sección de resultado
   */
  showError(message) {
    console.error('🎨 [UI] Renderizando vista de error:', message);
    alert(`Error en el procesamiento:\n${message}`);

    this.elements.resultSection.className = 'error';
    this.elements.resultSection.style.display = 'block';
    this.elements.resultSection.textContent = message;
  },

  /**
   * Restablece el botón a su estado normal ocultando la animación SVG
   */
  hideLoading() {
    console.log('🎨 [UI] Ocultando spinner SVG y habilitando botón');
    this.elements.submitBtn.disabled = false;
    this.elements.spinner.style.display = 'none';
    this.elements.btnText.textContent = 'Procesar contenido';
  }
};