---
'@backstage/cli': patch
---

Ignore setupTests and the file inside ./dev folder recursively. Eslint
can not resolve relative paths as we defined in the rule import/no-extraneous-dependencies, and it does not apply this rule.

A downside to use a recursive definition would be to checking all `dev` folders, which might not be wanted. Ensure you don't use
the `dev` folder out of scope (must be used for dev. env. only)
