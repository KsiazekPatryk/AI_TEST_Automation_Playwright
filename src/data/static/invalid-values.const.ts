/**
 * Universal invalid-value arrays for negative/validation API & UI tests.
 *
 * Import these constants in test specs and iterate with `for...of` / `forEach` loops —
 * avoid redefining arbitrary invalid primitives inline.
 *
 * The file is `.ts` (not `.json`) so it can represent `undefined` and retain `as const` narrow types.
 */

export const INVALID_STRING_VALUES = [123, true, null, undefined] as const;

export const INVALID_NUMBER_VALUES = [
  'string',
  '123',
  true,
  null,
  undefined,
] as const;

export const INVALID_BOOLEAN_VALUES = ['yes', 1, 0, null, undefined] as const;

export const INVALID_UUID_VALUES = [
  'not-a-uuid',
  '',
  123,
  null,
  undefined,
] as const;

export const INVALID_ENUM_VALUES = [
  'invalidValue',
  '',
  123,
  null,
  undefined,
] as const;

export const INVALID_ARRAY_VALUES = [
  'string',
  123,
  null,
  undefined,
  {},
] as const;

export const INVALID_OBJECT_VALUES = [
  'string',
  123,
  null,
  undefined,
  [],
] as const;
