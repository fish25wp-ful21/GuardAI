export function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function validateName(name) {
  if (!name || name.trim().length < 2) return false;
  return /^[a-zA-Z0-9 ]+$/.test(name);
}

export function validateNotes(notes) {
  if (!notes || notes.trim().length === 0) return false;
  return notes.length <= 10000;
}

