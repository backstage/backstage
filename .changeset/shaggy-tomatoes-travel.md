---
'@backstage/cli': patch
---

Enhance the behavior of the experimental support for module federation in the backstage CLI,
by using the `package.json` exports (when present) to complete the list of exposed modules.
This allows, for example, using exported `alpha` definitions through module federation.
