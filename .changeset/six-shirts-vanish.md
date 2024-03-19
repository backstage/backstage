---
'@backstage/cli': minor
---

The backend devlopment server transpilation has been replaced with a simplified solution based on SWC, which is already the transpiler used for tests. This fixed an issue where never versions of the `tsx` dependency had a new contract for signalling dependencies, breaking watch mode. This change fixed file watches as well as enables sourcemaps.
