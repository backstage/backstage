---
'@backstage/plugin-scaffolder-backend': patch
---

- **DEPRECATED** - The `containerRunner` option passed to `createBuiltinActions` has now been deprecated.

- **DEPRECATED** - The `createFetchCookiecutterAction` export has also been deprecated and will soon disappear from this plugin.

The `fetch:cookiecutter` action will soon be removed from the default list of actions that are provided out of the box from the scaffolder plugin. It will still be supported, and maintained by the community, so you can install the package (`@backstage/plugin-scaffolder-backend-module-cookiecutter`) and pass it in as a custom action. Or you can migrate your templates to use [`fetch:template`](https://backstage.io/docs/features/software-templates/builtin-actions#migrating-from-fetchcookiecutter-to-fetchtemplate) with the `cookiecutterCompat` option.
