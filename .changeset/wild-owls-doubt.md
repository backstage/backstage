---
'@backstage/plugin-scaffolder-backend': minor
---

The built-in module list has been trimmed down when using the new Backend System. Provider specific modules should now be installed with `backend.add` to provide additional actions to the scaffolder. These modules are as follows:

- `@backstage/plugin-scaffolder-backend-module-github`
- `@backstage/plugin-scaffolder-backend-module-gitlab`
- `@backstage/plugin-scaffolder-backend-module-bitbucket`
- `@backstage/plugin-scaffolder-backend-module-gitea`
- `@backstage/plugin-scaffolder-backend-module-gerrit`
- `@backstage/plugin-scaffolder-backend-module-confluence-to-markdown`
- `@backstage/plugin-scaffolder-backend-module-cookiecutter`
- `@backstage/plugin-scaffolder-backend-module-rails`
- `@backstage/plugin-scaffolder-backend-module-sentry`
- `@backstage/plugin-scaffolder-backend-module-yeoman`
