---
'@backstage/plugin-kubernetes': patch
---

The Kubernetes plugin will now re-fetch the kubernetes objects every ten seconds (not current configurable), this allows users to track the progress of deployments without refreshing the browser.
