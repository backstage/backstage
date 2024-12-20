---
'@backstage/plugin-search-backend-module-catalog': minor
---

**BREAKING**: Removed support for the old backend system. Please [migrate to the new backend system](https://backstage.io/docs/backend-system/) and enable [the catalog collator](https://backstage.io/docs/features/search/collators#catalog) there.

As part of this, the `/alpha` export path is gone too. Just import the module from the root of the package as usual instead.
