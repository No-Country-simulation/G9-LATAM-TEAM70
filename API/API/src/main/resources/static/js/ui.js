/**
 * Manipulación del DOM y estado visual de la UI
 */
export const UI = {
  elements: {
    form: document.querySelector('#content-form'),
    titleInput: document.querySelector('#title'),
    contentInput: document.querySelector('#content'),
    submitBtn: document.querySelector('#submit'),
    resultSection: document.querySelector('#result')
  },

  /**
   * Obtiene los valores ingresados en el formulario
   */
  getFormData() {
    return {
      title: this.elements.titleInput.value.trim(),
      content: this.elements.contentInput.value.trim()
    };
  },

  /**
   * Cambia el botón a estado de carga
   */
  showLoading() {
    this.elements.submitBtn.disabled = true;
    this.elements.resultSection.className = '';
    this.elements.resultSection.style.display = 'block';
    this.elements.resultSection.textContent = 'Procesando contenido...';
  },

  /**
   * Muestra la respuesta mapeada de ContentResponse
   * @param {Object} data Objeto ContentResponse de Spring Boot
   */
  showSuccess(data) {
    const confidence = data.score ? (data.score * 100).toFixed(0) : 'N/A';
    const keywords = Array.isArray(data.keywords) ? data.keywords.join(', ') : 'Ninguna';

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
   * Muestra mensajes de error
   */
  showError(message) {
    this.elements.resultSection.className = 'error';
    this.elements.resultSection.style.display = 'block';
    this.elements.resultSection.textContent = message;
  },

  /**
   * Restablece el botón de envío
   */
  hideLoading() {
    this.elements.submitBtn.disabled = false;
  }
};