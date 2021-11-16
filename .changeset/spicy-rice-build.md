---
'@backstage/backend-common': patch
---

Do not redact empty or one-character strings. These imply that it's just a test or local dev, and unnecessarily ruin the log output.
