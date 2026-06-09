export function normalizePhoneNumber(number) {
  if (!number) return '';
  let normalized = number.trim().replace(/[\s\-\(\)]/g, '');
  if (normalized.startsWith('0')) {
    normalized = '+62' + normalized.substring(1);
  }
  return normalized;
}

export function detectNumberType(number) {
  const cleaned = number.replace(/[\s\-\(\)\+]/g, '');
  if (/^(62811|62812|62813|62815|62816|62819)/.test(cleaned)) {
    return { type: 'mobile', operator: 'GSM Telco Provider', emoji: '📱' };
  }
  return { type: 'unknown', operator: 'Private / VoIP Number', emoji: '❓' };
}

export function containsSpamKeywords(text) {
  const keywords = ['pinjaman', 'dana', 'cepat', 'hadiah', 'undian', 'pemenang', 'slot', 'gacor', 'ditransfer'];
  const lower = text.toLowerCase();
  const found = keywords.filter(k => lower.includes(k));
  return { isSpam: found.length > 0, keywords: found };
}
