---
'@backstage/plugin-kubernetes-react': patch
---

The pod exec terminal now loads `@xterm/xterm` and its stylesheet when a terminal is opened, instead of including them in the initial bundle.
