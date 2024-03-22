---
'@backstage/backend-common': patch
---

KubernetesContainerRunner.runContainer no longer closes the `logStream` is receives as input.
