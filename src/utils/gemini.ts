import type { CategoryKey, DifficultyKey, WordPair } from '../data/words';

export interface GeminiWordGenerationParams {
  categories: CategoryKey[];
  difficulty: DifficultyKey;
}

const FALLBACK_HINTS = ['AI Generated', 'New Word Pair', 'Guess the impostor'];

export async function generateAiWordPair(
  params: GeminiWordGenerationParams,
  apiKey: string
): Promise<WordPair | null> {
  const categories = params.categories.filter(c => c !== 'Mixed' && c !== 'Custom');
  const categoryHint = categories.length > 0 ? categories.join(', ') : 'All categories';

  const prompt = `Generate a single word pair suitable for a social deduction party game.
Return valid JSON only with this exact structure:
{
  "common": "...",
  "impostor": "...",
  "hints": ["...", "...", "..."],
  "commonVisual": { "emojis": "...", "description": "..." },
  "impostorVisual": { "emojis": "...", "description": "..." }
}

Requirements:
- Keep the common and impostor words short and easy to understand.
- The impostor word should be related to the common word but not identical.
- Provide at least 3 short hints.
- Use 2-5 emoji characters for each visual.
- Do not include any explanation or text outside the JSON object.
- Prefer fresh word ideas that are not from a built-in game word list.
Categories: ${categoryHint}
Difficulty: ${params.difficulty}`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: { text: prompt },
      temperature: 0.65,
      maxOutputTokens: 180
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const rawOutput = data?.candidates?.[0]?.output;

  if (typeof rawOutput !== 'string' || rawOutput.trim().length === 0) {
    throw new Error('Gemini returned empty output');
  }

  return parseWordPairOutput(rawOutput, params.difficulty);
}

function parseWordPairOutput(text: string, difficulty: DifficultyKey): WordPair | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return null;
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);

    const common = typeof parsed.common === 'string' ? parsed.common.trim() : '';
    const impostor = typeof parsed.impostor === 'string' ? parsed.impostor.trim() : '';
    const hints = Array.isArray(parsed.hints)
      ? parsed.hints.map((hint: unknown) => typeof hint === 'string' ? hint.trim() : '').filter(Boolean)
      : [];

    if (!common || !impostor) {
      return null;
    }

    const commonVisual = isValidVisual(parsed.commonVisual)
      ? parsed.commonVisual
      : { emojis: '❔', description: 'A simple visual clue for the common word.' };

    const impostorVisual = isValidVisual(parsed.impostorVisual)
      ? parsed.impostorVisual
      : { emojis: '❔', description: 'A simple visual clue for the impostor word.' };

    return {
      common,
      impostor,
      hints: hints.length > 0 ? hints : FALLBACK_HINTS,
      commonVisual,
      impostorVisual,
      difficulty
    };
  } catch {
    return null;
  }
}

function isValidVisual(value: unknown): value is { emojis: string; description: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as any).emojis === 'string' &&
    typeof (value as any).description === 'string'
  );
}
