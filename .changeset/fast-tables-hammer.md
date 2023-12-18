---
'@backstage/cli': patch
---

Use sha256 instead of md5 in build script cache key calculation

Makes it possible to build on FIPS nodejs.
