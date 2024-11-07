---
'@backstage/cli': minor
---

The package packing now populates `typesVersions` for additional entry points rather than using additional `package.json` files for type resolution. This improves auto completion of separate entry points when consuming published packages.
