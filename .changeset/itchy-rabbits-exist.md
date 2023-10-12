---
'@backstage/cli': minor
---

**BREAKING** The new backend start command that used to be enabled by setting `EXPERIMENTAL_BACKEND_START` is now the default. To revert to the old behavior set `LEGACY_BACKEND_START`, which is recommended if you haven't migrated to the new backend system.

This new command is no longer based on Webpack, but instead uses Node.js loaders to transpile on the fly. Rather than hot reloading modules the entire backend is now restarted on change, but the SQLite database state is still maintained across restarts via a parent process.
