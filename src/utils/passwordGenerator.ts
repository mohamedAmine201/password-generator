export type CharsetKey = "uppercase" | "lowercase" | "numbers" | "symbols";

export type PasswordOptions = Record<CharsetKey, boolean>;

export const CHARSETS: Record<CharsetKey, string> = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "@#$",
};

export const CHARSET_KEYS = Object.keys(CHARSETS) as CharsetKey[];

export const MIN_LENGTH = 8;
export const MAX_LENGTH = 64;

/**
 * Returns an unbiased random integer in [0, max) using rejection sampling
 * on top of crypto.getRandomValues().
 */
export function secureRandomInt(max: number): number {
  if (!Number.isInteger(max) || max <= 0 || max > 0x100000000) {
    throw new RangeError("max must be an integer between 1 and 2^32");
  }
  const range = 0x100000000; // 2^32
  const limit = range - (range % max); // largest multiple of max <= 2^32
  const buffer = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % max;
}

function pickChar(charset: string): string {
  return charset[secureRandomInt(charset.length)];
}

// Fisher-Yates shuffle driven by the secure RNG.
function secureShuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function getEnabledSets(options: PasswordOptions): CharsetKey[] {
  return CHARSET_KEYS.filter((key) => options[key]);
}

/**
 * Generates a password of `length` characters from the enabled categories,
 * guaranteeing at least one character from each enabled category.
 * Throws if no category is enabled or the length is out of range.
 */
export function generatePassword(
  length: number,
  options: PasswordOptions,
): string {
  const enabled = getEnabledSets(options);
  if (enabled.length === 0) {
    throw new Error("Select at least one character type.");
  }
  if (!Number.isInteger(length) || length < MIN_LENGTH || length > MAX_LENGTH) {
    throw new RangeError(
      `Length must be between ${MIN_LENGTH} and ${MAX_LENGTH}.`,
    );
  }

  const pool = enabled.map((key) => CHARSETS[key]).join("");

  // One guaranteed character per enabled category...
  const chars = enabled.map((key) => pickChar(CHARSETS[key]));
  // ...then fill the rest from the combined pool.
  while (chars.length < length) {
    chars.push(pickChar(pool));
  }

  return secureShuffle(chars).join("");
}
