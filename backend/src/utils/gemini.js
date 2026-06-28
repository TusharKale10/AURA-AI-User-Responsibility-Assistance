const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-3.5-flash'];

export const geminiChat = async (prompt) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not set');
  let lastErr;
  for (const modelName of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${key}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      let res;
      try {
        res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }
      const data = await res.json();
      if (!res.ok) {
        const err = new Error(data.error?.message || `HTTP ${res.status}`);
        err.status = res.status;
        if (res.status === 404 || res.status === 429) { lastErr = err; continue; }
        throw err;
      }
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (err) {
      lastErr = err;
      const msg = err.message || '';
      if (msg.includes('404') || msg.includes('not found') || msg.includes('429') || msg.includes('quota')) continue;
      throw err;
    }
  }
  throw lastErr;
};

export const isQuotaError = (err) => {
  const msg = err?.message || '';
  return err?.status === 429 || msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED');
};

export const safeGeminiChat = async (prompt, fallback) => {
  try {
    return { text: await geminiChat(prompt), usedFallback: false };
  } catch (err) {
    return { text: typeof fallback === 'function' ? fallback() : fallback, usedFallback: true };
  }
};
