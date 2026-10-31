---
'@backstage/cli-module-auth': patch
---

Fixed `auth login` to include the CLI's client ID when exchanging authorization codes, supporting auth backends that enforce client ID binding.
