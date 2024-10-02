---
'@backstage/backend-app-api': patch
---

The backend will no longer exit immediately if any plugin or modules fails to initialize. Instead, the backend will wait for all plugins and modules to either start up successfully or throw, and then shut down the backend if there were any initialization errors.

This fixes an issue where backend initialization errors in adjacent plugins during database schema migration could cause the database migrations to be stuck in a locked state.
