import { env } from '../config/env.js';

const MODEL = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const fmt = (i) =>
  `id: ${i._id}\n  title: ${i.title}\n  category: ${i.category}\n  location: ${i.location}${
    i.locationOther ? ` (${i.locationOther})` : ''
  }\n  date: ${new Date(i.dateLostOrFound).toISOString().slice(0, 10)}\n  description: ${i.description}`;

// Ask Gemini to rank which candidate reports likely refer to the SAME physical
// object as the new report. Returns [{ id, score (0-100), reason }].
// Uses structured JSON output so we never have to parse free text.
export async function rankMatches(newItem, candidates) {
  if (!env.GEMINI_API_KEY) {
    console.warn('[gemini] GEMINI_API_KEY not set — skipping AI ranking.');
    return [];
  }

  const oppositeType = newItem.type === 'lost' ? 'found' : 'lost';
  const prompt = `You are the matching engine for a university campus lost-and-found app at SMVDU.

A new ${newItem.type.toUpperCase()} report was just posted:
  ${fmt(newItem)}

Here are open ${oppositeType.toUpperCase()} reports to compare against:
${candidates.map((c) => `- ${fmt(c)}`).join('\n')}

For each candidate that plausibly refers to the SAME physical object, return its id, a confidence score from 0 to 100, and a short one-line reason (mention the shared cues: object, colour/brand, location, date). Be strict: only include candidates that are a believable match (score >= 40). If none match, return an empty list.`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          matches: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                id: { type: 'STRING' },
                score: { type: 'NUMBER' },
                reason: { type: 'STRING' },
              },
              required: ['id', 'score', 'reason'],
            },
          },
        },
        required: ['matches'],
      },
    },
  };

  // Gemini's free tier can return 503 (overloaded) or 429 (rate limit) under
  // load — both transient. Retry a couple of times with backoff.
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let res;
  for (let attempt = 0; attempt < 3; attempt++) {
    res = await fetch(`${ENDPOINT}?key=${env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) break;
    if ((res.status === 503 || res.status === 429) && attempt < 2) {
      await sleep(1200 * (attempt + 1));
      continue;
    }
    const detail = await res.text().catch(() => '');
    throw new Error(`Gemini ranking failed (${res.status}): ${detail.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{"matches":[]}';
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    console.error('[gemini] could not parse JSON:', text.slice(0, 200));
    return [];
  }
  // Clamp + sanitise.
  return (parsed.matches || [])
    .filter((m) => m && m.id)
    .map((m) => ({
      id: String(m.id),
      score: Math.max(0, Math.min(100, Math.round(Number(m.score) || 0))),
      reason: String(m.reason || '').slice(0, 240),
    }));
}
