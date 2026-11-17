---
'@backstage/frontend-plugin-api': patch
---

Added `coreApis`, an object of core Utility API refs, with framework infrastructure APIs grouped under `coreApis.internal`: app lifecycle, OAuth requests, plugin header actions, plugin wrappers, and swappable components. The nested object is public. The deprecated Alert API is excluded in favor of Toast. The individual refs with object equivalents are deprecated in favor of their matching object members, while remaining compatible. Provider-specific authentication refs remain separate and are not deprecated.
