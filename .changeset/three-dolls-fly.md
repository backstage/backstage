---
'@backstage/cli': patch
---

Switched the `lint` command to invoke ESLint directly through its Node.js API rather than spawning a new process.
