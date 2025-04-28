---
'@backstage/plugin-auth-backend': minor
---

**BREAKING**: Removed support for the old backend system, and removed all deprecated exports.

If you were using one of the deprecated imports from this package, you will have to follow the instructions in their respective deprecation notices before upgrading. Most of the general utilities are available from `@backstage/plugin-auth-node`, and the specific auth providers are available from dedicated packages such as for example `@backstage/plugin-auth-backend-module-github-provider`. See [the auth docs](https://backstage.io/docs/auth/) for specific instructions.
