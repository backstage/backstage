---
'@backstage/core-components': patch
'@backstage/app-defaults': patch
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-techdocs': patch
'@backstage/plugin-catalog': patch
'@backstage/theme': patch
'@backstage/plugin-home': patch
---

- Allow custom star icons to be provided via the `star` and `unstarred` icon overides. See how to override existing icons in the [Backstage documentation](https://backstage.io/docs/getting-started/app-custom-theme/#custom-icons).
- Add `entityStarButton.color` theme option to allow custom themes to specify color for filled star icons.
