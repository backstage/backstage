---
'@backstage/config-loader': patch
---

Configuration schema errors are now filtered using the provided visibility option. This means that schema errors due to missing backend configuration will no longer break frontend builds.
