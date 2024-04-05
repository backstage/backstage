---
'@backstage/plugin-kubernetes-backend': patch
---

**BREAKING** The kubernetes backend now can handle when req.header is undefined.

These changes are **required** to `plugins/kubernetes-backend/src/service/KubernetesProxy.ts`

```diff
-- a/plugins/kubernetes-backend/src/service/KubernetesProxy.ts
+++ b/plugins/kubernetes-backend/src/service/KubernetesProxy.ts
@@ -172,7 +172,7 @@ export class KubernetesProxy {
             )?.toString(),
           };

-          const authHeader = req.header(HEADER_KUBERNETES_AUTH);
+          const authHeader = req.header?.(HEADER_KUBERNETES_AUTH);
           if (authHeader) {
             req.headers.authorization = authHeader;
           } else {
```
