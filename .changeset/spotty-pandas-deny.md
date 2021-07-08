---
'@backstage/plugin-scaffolder-backend': patch
'@backstage/plugin-scaffolder-backend-module-rails': patch
---

- Align versions for the rails plugin
- Move out the cookiecutter templating to it's own module that is depended on by the `scaffolder-backend` no breaking change yet, but we will drop first class support for `cookiecutter` in the future and it will become an opt-in feature.
