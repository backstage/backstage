---
'@backstage/backend-defaults': patch
---

Fixed bug in PackageDiscoveryService where packages with "exports" field caused ERR_PACKAGE_PATH_NOT_EXPORTED error during backend startup.
