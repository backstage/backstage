---
'@backstage/plugin-catalog-backend-module-incremental-ingestion': patch
---

Improved the getting started experience: corrected the installation import path (was incorrectly using the `/alpha` export), reordered the README setup steps so new users can follow them top-to-bottom without `yarn start` failing, and moved large example code blocks into dedicated files under `examples/providers/` and `examples/modules/`.

Fixed a bug where database tables were never created if no providers were registered, causing admin routes to fail on a fresh install. Migrations now run at module startup and respect `database.migrations?.skip`, consistent with `auth-backend` and `search-backend-module-pg`.

Added permissions for the admin routes: `catalog.incremental-ingestion.read` for status endpoints and `catalog.incremental-ingestion.admin` for mutating actions.
