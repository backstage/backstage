---
'@backstage/create-app': patch
---

Removed the database choice from the `create-app` command.

This reduces the step from development to production by always installing the dependencies and templating the production configuration in `app-config.production.yaml`.

Added `app-config.local.yaml` to allow for local configuration overrides.
