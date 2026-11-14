---
'@backstage/repo-tools': patch
---

`package-docs` no longer fails outside the Backstage repository, and OpenAPI server generation skips Prettier when it isn't installed. The OpenAPI `diff` commands now find the specs at the base ref when the project is in a subdirectory of the git repository. Commands also tell the package manager workspace apart from the Backstage installation inside it, as groundwork for pnpm support. In a Yarn workspace both are the same directory.
