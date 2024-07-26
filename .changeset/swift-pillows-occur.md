---
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-kubernetes-common': patch
'@backstage/plugin-kubernetes-node': patch
---

Fixed the lack of `secrets` to fetch from the kubernetes api by adding option to specify additional Objects which are not part of Default Objects
