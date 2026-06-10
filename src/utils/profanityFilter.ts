const GLOBAL_BLACKLIST = [
  'fuck',
  'cunt',
  'bitch',
  'faggot',
  'nigger',
  'whore',
  'slut',
  'chink',
  'kike',
  'retard',
  'motherfucker',
  'fuk',
  'btch',
  'biatch',
  'lmfao',
  'stfu'
];

const BOUNDARY_BLACKLIST = [
  'ass',
  'asshole',
  'bastard',
  'dick',
  'pussy',
  'cock',
  'prick',
  'wanker',
  'bollocks',
  'crap',
  'fk',
  'faq',
  'wtf',
  'cnt',
  'bch'
];

const LEET_CHAR_MAP: Record<string, string> = {
  'a': '[a@4▲]',
  'e': '[e3€]',
  'i': '[i1!|¡]',
  'o': '[o0]',
  's': '[s5$§]',
  't': '[t7+]',
  'w': '(w|vv|uu)',
  'c': '[cck]'
};

const escapeRegex = (str: string): string => {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

const compileLeetPattern = (word: string, requireBoundaries: boolean): RegExp => {
  const chars = word.split('');
  const patternStr = chars
    .map((c, idx) => {
      const charPattern = LEET_CHAR_MAP[c] || escapeRegex(c);
      if (idx === chars.length - 1) {
        return `${charPattern}+`;
      }
      return `${charPattern}+[^a-zA-Z]*`;
    })
    .join('');
  
  if (requireBoundaries) {
    return new RegExp(`\\b${patternStr}(s|es|y|er|ing|ed)?\\b`, 'gi');
  } else {
    return new RegExp(patternStr, 'gi');
  }
};

const LEET_GLOBAL_PATTERNS = GLOBAL_BLACKLIST.map(word => compileLeetPattern(word, false));
const LEET_BOUNDARY_PATTERNS = BOUNDARY_BLACKLIST.map(word => compileLeetPattern(word, true));

/**
 * Removes accents/diacritics from a string (e.g. fûck -> fuck).
 */
const removeAccents = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

/**
 * Checks if a given text contains profane or vulgar words.
 */
export const containsProfanity = (text: string): boolean => {
  if (!text) return false;
  
  const normalized = removeAccents(text);
  
  for (const pattern of LEET_GLOBAL_PATTERNS) {
    if (pattern.test(normalized)) {
      pattern.lastIndex = 0;
      return true;
    }
    pattern.lastIndex = 0;
  }
  
  for (const pattern of LEET_BOUNDARY_PATTERNS) {
    if (pattern.test(normalized)) {
      pattern.lastIndex = 0;
      return true;
    }
    pattern.lastIndex = 0;
  }
  
  return false;
};

/**
 * Censors profane words in the text with asterisks (*).
 */
export const cleanText = (text: string): string => {
  if (!text) return '';
  
  const normalized = removeAccents(text);
  let cleaned = normalized;
  
  for (const pattern of LEET_GLOBAL_PATTERNS) {
    cleaned = cleaned.replace(pattern, (match) => '*'.repeat(match.length));
  }
  
  for (const pattern of LEET_BOUNDARY_PATTERNS) {
    cleaned = cleaned.replace(pattern, (match) => '*'.repeat(match.length));
  }
  
  return cleaned;
};
