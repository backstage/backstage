---
'@backstage/repo-tools': patch
---

Fixed `package schema openapi generate` producing duplicate imports in nested generated files, such as when the same schema is referenced by operations under different OpenAPI tags. The command now also exits with a non-zero status code when client or server generation fails, instead of only logging the error.
