---
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-search-react': patch
'@backstage/plugin-catalog': patch
---

The `/alpha` export no longer export extension creators for the new frontend system, existing usage should be switched to use the equivalent extension blueprint instead. For more information see the [new frontend system 1.30 migration documentation](https://backstage.io/docs/frontend-system/architecture/migrations#130).
