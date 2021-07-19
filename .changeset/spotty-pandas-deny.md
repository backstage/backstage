---
'@backstage/plugin-scaffolder-backend': patch
---

- Move out the `cookiecutter` templating to its own module that is depended on by the `scaffolder-backend` plugin. No breaking change yet, but we will drop first class support for `cookiecutter` in the future and it will become an opt-in feature.
