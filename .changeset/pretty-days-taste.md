---
'@backstage/backend-defaults': patch
---

Fixed `yarn backstage-cli config:check --strict --config app-config.yaml` config validation error by adding
an optional `default` type discriminator to PostgreSQL connection configuration,
allowing `config:check` to properly validate `default` connection configurations.
