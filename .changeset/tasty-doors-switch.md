---
'@backstage/cli': patch
---

Explicitly set `exports: 'named'` for CJS builds, ensuring that they have e.g. `exports["default"] = catalogPlugin;`
