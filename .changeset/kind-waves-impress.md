---
'@backstage/cli': patch
---

Fixed the package prepack command so that it no longer produces unnecessary `index` entries in the `typesVersions` map, which could cause `/index` to be added when automatically adding imports.
