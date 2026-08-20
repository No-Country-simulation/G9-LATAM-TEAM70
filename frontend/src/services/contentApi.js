export async function classifyContent({ title, content }) {
  const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/contenido`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'No fue posible clasificar el contenido.');
  }

  return response.json();
}
