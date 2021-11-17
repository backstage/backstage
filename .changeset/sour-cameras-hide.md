---
'@backstage/cli': patch
---

Fixed a bug where calling `backstage-cli backend:bundle --build-dependencies` with no dependencies to be built would cause all monorepo packages to be built instead.
