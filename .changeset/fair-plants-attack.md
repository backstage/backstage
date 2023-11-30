---
'@backstage/plugin-kubernetes-react': minor
'@backstage/plugin-kubernetes': patch
---

Change `formatClusterLink` to be an API and make it async for further customization possibilities.

**BREAKING**
If you have a custom k8s page and used `formatClusterLink` directly, you need to migrate to new `kubernetesClusterLinkFormatterApiRef`
