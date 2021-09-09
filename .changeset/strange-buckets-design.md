---
'@backstage/plugin-catalog-backend': patch
---

This change drops support for deprecated location types which have all been replaced by the `url` type.
There has been a deprecation warning in place since the beginning of this year so most should already be migrated and received information at this point.

The now removed location types are:

```
github
github/api
bitbucket/api
gitlab/api
azure/api
```
