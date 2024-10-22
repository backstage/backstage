---
'@backstage/plugin-scaffolder-react': patch
---

Fix issue with `Stepper` and trying to trim additional properties. This is now all behind `liveOmit` and `omitExtraData` instead.
