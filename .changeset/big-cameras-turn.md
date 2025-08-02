---
'@backstage/backend-defaults': patch
---

Fixed cache namespace and key prefix separator configuration to properly use configured values instead of hardcoded plugin ID. The cache manager now correctly combines the configured namespace with plugin IDs using the configured separator for Redis and Valkey. Memcache and memory store continue to use plugin ID as namespace.
