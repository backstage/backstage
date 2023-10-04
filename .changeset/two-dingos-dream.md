---
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-kubernetes-react': patch
'@backstage/plugin-kubernetes-common': patch
---

The kubernetes APIs invokes Authentication Strategies when Backstage-Kubernetes-Authorization-X-X headers are provided, this enable the possibility to invoke strategies that executes additional steps to get a kubernetes token like on pinniped or custom strategies
