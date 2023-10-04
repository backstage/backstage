---
'@backstage/cli': minor
---

The new backend start command that used to be enabled by setting `EXPERIMENTAL_BACKEND_START` is now the default. To revert to the old behavior, set `LEGACY_BACKEND_START` instead.

This new command is no longer based on Webpack, but instead uses Node.js loaders to transpile on the fly. Rather than hot reloading modules the entire backend is now restarted on change, but the SQLite database state is still maintained across restarts via a parent process.
