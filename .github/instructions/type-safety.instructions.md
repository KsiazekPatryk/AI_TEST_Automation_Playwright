---
applyTo: '**/*.ts'
---

# TypeScript & Type-Safety Guidelines

## Rules & Standards

- **Strict Mode:** Never use `any`. Use `unknown` with runtime validation (such as Zod) or typed models.
- **Model Interfaces:** Every Payload and Response model interface must include `[key: string]: unknown;` as its index signature.
- **Zod Runtime Validation:** Validate API response bodies and dynamic inputs with Zod `safeParse()`. Check `result.success` before using parsed data.
- **Explicit Return Types:** Add explicit return types for exported functions, steps, and API request helpers.
- **Const Assertions:** Use `as const` on static arrays and test configuration objects to retain narrow literal types.
- **No Untyped JSON:** Avoid raw untyped `response.json()`; use `parseResponse<T>(response)` with explicit type parameters.
