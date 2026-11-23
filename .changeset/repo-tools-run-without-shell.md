---
'@backstage/repo-tools': patch
---

The OpenAPI schema commands and `generate-patch` now run external tools without going through a shell, so paths containing spaces or special characters are handled correctly, and a failing command now reports a proper error with its exit code.
