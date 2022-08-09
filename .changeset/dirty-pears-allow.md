---
'@backstage/backend-common': patch
---

Added a second validation to the `dir()` method of ZIP archive responses returned from `readTree()` that ensures that extracted files do not fall outside the target directory.
