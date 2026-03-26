---
'@backstage/eslint-plugin': patch
---

Fixed `no-mixed-plugin-imports` rule to return `null` from non-fixable suggestion handlers and added an explicit `SuggestionReportDescriptor[]` type annotation, matching the stricter type checking in TypeScript 6.0.
