---
'@backstage/plugin-scaffolder-backend': patch
---

Add new `fetch:template` action which handles the same responsibilities as `fetch:cookiecutter` without the external dependency on `cookiecutter`. For information on migrating from `fetch:cookiecutter` to `fetch:template`, see the [migration guide](https://backstage.io/docs/features/software-templates/builtin-actions#migrating-from-fetch-cookiecutter-to-fetch-template) in the docs.
