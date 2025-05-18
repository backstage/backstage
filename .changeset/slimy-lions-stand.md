---
'@backstage/plugin-kubernetes-backend': minor
'@backstage/plugin-kubernetes-react': minor
'@backstage/plugin-kubernetes': patch
---

---

## '@backstage/kubernetes-backend': minor

Added the ability to stream logs using a websocket connection.
Existing APIs to get logs using a simple GET request still exist.

## '@backstage/kubernetes-react': minor

Modified the Pod logs viewer to use a socket connection to get logs
and added a couple of new APIs to make this happen. Existing APIs intact.

## '@backstage/plugin-kubernetes': patch

A dependency change in the plugin factory was made to access Identity service.
