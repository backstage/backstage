---
'@backstage/plugin-kubernetes-backend': minor
---

**BREAKING** Allow passing undefined `labelSelector` to `KubernetesFetcher`

`KubernetesFetch` no longer auto-adds `labelSelector` when empty string was passed.
This is only applicable if you have custom ObjectProvider implementation, as build-in `KubernetesFanOutHandler` already does this
