---
'@backstage/plugin-catalog-import': patch
---

Support use without `integrations` or only integrations without frontend visible properties (e.g., `bitbucketCloud`) being configured by checking `integrations.github` directly without attempting to load `integrations`.
