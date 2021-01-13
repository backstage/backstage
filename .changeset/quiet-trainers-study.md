---
'example-backend': patch
'@backstage/create-app': patch
'@backstage/plugin-scaffolder-backend': patch
---

Bump the gitbeaker dependencies to 28.x.

To update your own installation, go through the `package.json` files of all of
your packages, and ensure that all dependencies on `@gitbeaker/node` or
`@gitbeaker/core` are at version `^28.0.2`. Then run `yarn install` at the root
of your repo.
