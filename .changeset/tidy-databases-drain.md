---
'@backstage/cli-module-build': patch
---

Development backends now exit immediately on Ctrl-C, including during startup or an ongoing shutdown, while restarts caused by edits or terminal input still run shutdown hooks before restarting. Embedded PostgreSQL remains available across restarts and cleans up independently after the development CLI exits or crashes. Each development process cleans up only its own temporary database.
