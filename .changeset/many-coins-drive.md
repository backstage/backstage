---
'@backstage/plugin-scaffolder-backend': minor
---

**BREAKING**:

- Removed the `createFetchCookiecutterAction` export, please use the `@backstage/plugin-scaffolder-backend-module-cookiecutter` package explicitly (see [its README](https://github.com/backstage/backstage/tree/master/plugins/scaffolder-backend-module-cookiecutter) for installation instructions).
- Removed the `containerRunner` argument from the types `RouterOptions` (as used by `createRouter`) and `CreateBuiltInActionsOptions` (as used by `createBuiltinActions`).
