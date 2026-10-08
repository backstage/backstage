---
'@backstage/cli-module-build': patch
---

Improved code splitting for frontend module federation remotes so that loading a feature does not also download unrelated lazy components from the same dependency scope. Shared dependencies and workspace code are reused across lazy boundaries. Regular application builds are unchanged.
