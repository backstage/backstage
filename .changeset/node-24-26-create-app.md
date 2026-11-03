---
'@backstage/create-app': patch
---

New apps now support Node.js 24 and 26, in line with the [versioning policy](https://backstage.io/docs/overview/versioning-policy#nodejs-releases). The `engines` field in the app template is set to `^24.15.0 || ^26.13.0`, and creating a new app now requires Node.js 24 (24.15.0 or later) or Node.js 26 (26.13.0 or later). 24.15.0 is the lowest version that all dependencies support, and 26.13.0 is the first Node.js 26 LTS release.

To update an existing app, set `engines.node` in your root `package.json` to `^24.15.0 || ^26.13.0`, and update the Node.js version used in your CI workflows and `Dockerfile` if needed.

If your `yarn.lock` resolves `avsc` to a version older than 5.7.8, run `yarn up -R avsc`. Those versions crash on load on Node.js 25 and later, which breaks Jest tests that import the AsyncAPI widget from `@backstage/plugin-api-docs`. If it resolves `node-gyp` to 12.3.0, run `yarn up -R node-gyp`, since that version can't download Node.js headers through a proxy on Node.js 26.
