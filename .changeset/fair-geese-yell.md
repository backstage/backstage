---
'@backstage/config-loader': minor
---

Add support for environment variable substitution in `$include` transform values.

This change allows for including dynamic paths, such as environment specific secrets by using the same environment variable substitution already supported outside of the `$include` transform (`${..}`).

If you are currently using the syntax `${...}` in your `$include` values, you will need to escape the substitution by using `$${...}` instead.
