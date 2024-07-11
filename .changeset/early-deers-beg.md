---
'@backstage/plugin-scaffolder-backend-module-github': patch
---

Fixed bug resulting from missing required owner and repo arguments in `getEnvironmentPublicKey` in action `github:environment:create`.

Adding environment secrets now works as expected.
