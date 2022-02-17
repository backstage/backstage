---
'@backstage/plugin-catalog-backend': minor
---

Made the `GitLabDiscoveryProcessor.updateLastActivity` method private, as it was accidentally exposed. It has also been fixed to properly operate in its own cache namespace to avoid collisions with other processors.
