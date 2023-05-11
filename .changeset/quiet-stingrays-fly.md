---
'@backstage/plugin-azure-devops': minor
---

The getBuildRuns function now checks contains multiple comma-separated builds and splits them to send multiple requests for each and concatenates the results.
