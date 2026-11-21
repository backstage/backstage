---
'@backstage/module-federation-common': patch
---

The Material UI, Emotion and React Router peer dependencies are now optional. The package only refers to these libraries by name, so they are no longer reported as missing, or installed automatically by pnpm, for the Backstage CLI.
