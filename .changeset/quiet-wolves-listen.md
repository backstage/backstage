---
'@backstage/frontend-plugin-api': patch
---

Added `coreApis`, a namespace of core Utility API refs, with framework infrastructure APIs grouped under `coreApis.internal`: app lifecycle, OAuth requests, plugin header actions, plugin wrappers, and swappable components. The nested namespace is public. The deprecated Alert API is excluded in favor of Toast. The individual refs with namespace equivalents are deprecated in favor of their matching namespace members, while remaining compatible. Provider-specific authentication refs remain separate and are not deprecated.
