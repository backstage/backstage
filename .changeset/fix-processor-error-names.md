---
'@backstage/plugin-catalog-backend': patch
---

Fixed processing error messages to use `getProcessorName()` instead of `constructor.name`, so that processor names remain useful in minified builds.
