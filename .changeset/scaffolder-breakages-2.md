---
'@backstage/plugin-scaffolder-backend': major
---

**BREAKING ALPHA**: The `/alpha` export no longer exports the plugin. Please use `import('@backstage/plugin-scaffolder-backend')` instead as this has been removed.

**BREAKING CHANGES**: The old `createRouter` function which was used in the old backend system has been removed along with the `RouterOptions` type.
