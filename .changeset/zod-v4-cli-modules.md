---
'@backstage/cli-module-auth': patch
'@backstage/cli-module-new': patch
---

Switched to version 4 of `zod` for internal validation. Validation errors for invalid templates now use the updated, more descriptive `zod` wording.
