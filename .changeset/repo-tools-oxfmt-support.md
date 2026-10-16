---
'@backstage/repo-tools': patch
---

API reports, SQL reports, and the code written by `package schema openapi generate` are now formatted with oxfmt when it's installed in the project root and either configured there or the only formatter installed. Otherwise Prettier is used as before. Formatting is skipped when neither is installed, which fixes `package schema openapi generate --server` failing in projects without Prettier.
