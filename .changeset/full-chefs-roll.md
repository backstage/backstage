---
'@backstage/cli': patch
---

Removed the script transform cache from the default Jest configuration. The script cache provided a moderate performance boost, but it is incomatible with Jest 30.
