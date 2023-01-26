---
'@backstage/cli': patch
---

The `backstage-cli repo test` command now sets a default Jest `--workerIdleMemoryLimit` of 1GB. This is the recommended workaround for dealing with Jest workers leaking memory and eventually hitting the heap limit.
