---
'@backstage/backend-defaults': patch
---

Added a new public `@backstage/backend-defaults/rootSystemMetadata` entrypoint, exporting `rootSystemMetadataServiceFactory` and `DefaultRootSystemMetadataService`. The system metadata service is now registered automatically as a default service, so backends no longer need to add it manually.
