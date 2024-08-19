---
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-search-react': patch
'@backstage/plugin-catalog': patch
---

The `/alpha` export no longer export extension creators for the new frontend system, existing usage should be switched to use the equivalent extension blueprint instead.
