---
'@backstage/repo-tools': patch
---

Added support for oxfmt as an alternative to Prettier when formatting API reports, SQL reports, and the code written by `package schema openapi generate`. oxfmt is used when the root `package.json` lists it as a dependency and it's either configured in the project root or the only formatter listed. Otherwise Prettier is used as before. The generated OpenAPI code is no longer formatted when the root `package.json` lists neither, which fixes `package schema openapi generate --server` failing in projects without Prettier.
