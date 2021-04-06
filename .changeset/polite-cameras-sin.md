---
'@backstage/test-utils': patch
---

Remove unnecessary wrapping of elements rendered by `wrapInTestApp` and `renderInTestApp`, which was breaking mount discovery.
