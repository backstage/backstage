---
'@backstage/plugin-scaffolder-backend-module-confluence-to-markdown': patch
'@backstage/plugin-scaffolder-backend-module-bitbucket-server': patch
'@backstage/plugin-scaffolder-backend-module-bitbucket-cloud': patch
'@backstage/plugin-scaffolder-backend-module-cookiecutter': patch
'@backstage/plugin-scaffolder-backend-module-bitbucket': patch
'@backstage/plugin-scaffolder-backend-module-gerrit': patch
'@backstage/plugin-scaffolder-backend-module-github': patch
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
'@backstage/plugin-scaffolder-backend-module-sentry': patch
'@backstage/plugin-scaffolder-backend-module-yeoman': patch
'@backstage/plugin-scaffolder-backend-module-azure': patch
'@backstage/plugin-scaffolder-backend-module-gitea': patch
'@backstage/plugin-scaffolder-backend-module-rails': patch
'@backstage/scaffolder-test-utils': patch
'@backstage/plugin-scaffolder-backend': patch
---

Introduced createMockActionContext to unify the way of creating scaffolder mock context.
It will help to maintain tests in a long run during structural changes of action context.
