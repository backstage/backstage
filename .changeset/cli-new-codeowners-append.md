---
'@backstage/cli-module-new': patch
---

Fixed `backstage-cli new` rewriting the entire `CODEOWNERS` file when an owner is provided. Existing content, including comments and formatting, is now preserved and a single repository-relative entry such as `/packages/my-lib/ @org/team` is appended, rather than an entry with an absolute filesystem path.
