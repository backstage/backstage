---
'@backstage/cli': minor
---

**BREAKING**: The provided Jest configuration now only matches files with a `.test.` infix, rather than any files that is suffixed with `test.<ext>`. In particular this means that files named just `test.ts` will no longer be considered a test file.
