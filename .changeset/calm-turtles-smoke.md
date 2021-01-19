---
'@backstage/core': patch
---

Removed InfoCard variant "height100", originally deprecated in [#2826](https://github.com/backstage/backstage/pull/2826).

If your component still relies on this variant, simply replace it with "gridItem".
