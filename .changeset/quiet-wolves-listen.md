---
'@backstage/frontend-plugin-api': patch
---

Added `coreApis`, a namespace of core Utility API refs. The deprecated Alert API is excluded in favor of Toast. The individual refs with namespace equivalents are deprecated in favor of their `coreApis` equivalents, while remaining compatible. Provider-specific authentication refs remain separate and are not deprecated.
