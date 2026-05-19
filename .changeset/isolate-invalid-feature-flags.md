---
'@backstage/frontend-app-api': patch
---

Invalid feature flag declarations no longer crash the app during bootstrap. They are now reported through the error collector and skipped, letting the rest of the app load normally.
