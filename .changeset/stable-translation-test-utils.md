---
'@backstage/frontend-test-utils': patch
---

Switched `MockTranslationApi` and related test utility imports from `@backstage/core-plugin-api/alpha` to the stable `@backstage/frontend-plugin-api` export. The `TranslationApi` type in the API report is now sourced from a single package. This has no effect on runtime behavior.
