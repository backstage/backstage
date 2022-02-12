---
'@backstage/cli': patch
---

Updated the default [sucrase](https://github.com/alangpierce/sucrase)-based Jest transform to include source maps if the environment variable `ENABLE_SOURCE_MAPS` is non-empty. This can be used to better support editor test debugging integrations.
