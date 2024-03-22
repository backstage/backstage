---
'@backstage/backend-common': patch
---

KubernetesContainerRunner.runContainer no longer closes the `logStream` it receives as input.
