---
'@backstage/backend-common': patch
---

Fix handling of previous prom-client metrics on hot restart. Previously the
metrics registry was cleared to later and might have deleted metrics that
were already registered after restart.
