// Text formatting helpers

const SYMBOL_ONLY = /^[\s▢•\-–—\d.)]+$/;

/**
 * Cleans up instruction text by removing numbered prefixes and common step labels.
 */
export const cleanInstruction = (instruction: string): string => {
  const cleaned = instruction
    .replace(/\s*[▢•]\s*/g, " ")
    .replace(/^\d+[.)\-\s]+/, "")
    .replace(/^\d+(?=[A-Za-z])/, "")
    .replace(/^Step\s+\d+[:\s]+/i, "")
    .replace(/^\d+(st|nd|rd|th)\s+step[:\s]+/i, "")
    .replace(
      /^(First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth)[:\s]+/i,
      "",
    )
    .replace(/^\d+[.\-)\s]+/, "")
    .trim();
  return cleaned;
};

/** True if the step has meaningful content (not empty or symbol-only). */
export const isMeaningfulStep = (step: string): boolean => {
  const s = step.trim();
  if (!s) return false;
  if (SYMBOL_ONLY.test(s)) return false;
  if (s.length < 2) return false;
  return true;
};
