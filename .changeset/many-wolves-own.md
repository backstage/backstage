---
'@backstage/config-loader': minor
---

The include transforms applied during config loading will now only apply to the known keys `$file`, `$env`, and `$include`. Any other key that begins with a `$` will now be passed through as is.
