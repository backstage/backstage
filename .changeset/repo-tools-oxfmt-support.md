---
'@backstage/repo-tools': patch
---

API reports, SQL reports, and the code written by `package schema openapi generate` are now formatted with oxfmt when the root `package.json` lists it as a dependency and it's either configured in the project root or the only formatter listed. Otherwise Prettier is used as before. The generated OpenAPI code is no longer formatted when the root `package.json` lists neither, which fixes `package schema openapi generate --server` failing in projects without Prettier.
