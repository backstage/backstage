---
'@backstage/plugin-catalog': patch
---

Variable 'catalogTranslationRef' is exported in translation.ts, but it was forgotten to also add it to the alpha entrypoint, so the code never became "visible"
