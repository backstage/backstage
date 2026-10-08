---
'@backstage/cli-module-build': patch
---

Improved code splitting for frontend module federation remotes to reduce unnecessary downloads of unrelated lazy components from the same dependency scope. Shared dependencies and workspace code are extracted across lazy boundaries when the resulting shared chunk meets the size threshold. Regular application builds are unchanged.
