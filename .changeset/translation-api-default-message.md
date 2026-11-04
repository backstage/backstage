---
'@backstage/frontend-plugin-api': minor
---

**BREAKING CONSUMERS**: Custom `TranslationApi` implementations must now provide `getDefaultMessage(selection, options?)`. This synchronously formats the ref's declared default message, independently of the selected language and installed overrides. Formatting values are optional; omitting them leaves replacement placeholders intact, and plural messages use the other form. Plugin callers of the existing translation API methods do not need to change.
