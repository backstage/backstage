---
'@backstage/config-loader': minor
---

Fix bug where `$${...}` was not being escaped to `${...}`

Add support for environment variable substitution in `$include`, `$file` and
`$env` transform values.

- This change allows for including dynamic paths, such as environment specific
  secrets by using the same environment variable substitution (`${..}`) already
  supported outside of the various include transforms.
- If you are currently using the syntax `${...}` in your include transform values,
  you will need to escape the substitution by using `$${...}` instead to maintain
  the same behavior.
