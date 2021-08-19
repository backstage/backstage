---
'@backstage/backend-common': patch
---

Read responses in `UrlReader#read()` as array buffer instead of as text to allow reading non-text locations such as images.
