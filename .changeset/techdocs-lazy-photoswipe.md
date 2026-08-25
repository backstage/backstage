---
'@backstage/plugin-techdocs-module-addons-contrib': patch
---

The LightBox addon now loads `photoswipe` and its stylesheet when the addon mounts, instead of including them in the initial bundle for every app that uses any addon from this package.
