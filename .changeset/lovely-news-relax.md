---
'@backstage/cli': patch
---

The built-in Jest configuration now always uses the Jest environments that are bundled with the CLI by default. This avoids a situation where Jest potentially picks up an incompatible version of the environment package from a different dependency in the project.
