---
'@backstage/cli-module-oxlint': patch
---

Standardized context API usage across lint rules by extracting shared `resolveCwd` and `resolveFilePath` utilities, replacing duplicated inline fallback chains.
