---
'@backstage/plugin-kubernetes-react': minor
---

**BREAKING** The pod exec terminal is now disabled by default since there are several scenarios where it is known not to work. It can be re-enabled at your own risk by setting the config parameter `kubernetes.podExecTerminal.enabled` to `true`.
