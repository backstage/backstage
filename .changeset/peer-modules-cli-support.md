---
'@backstage/cli': patch
'@backstage/cli-node': patch
---

Added support for the new `peerModules` metadata field in `package.json`. This field allows plugin packages to declare modules that should be installed alongside them for cross-plugin integrations. The field is validated by `backstage-cli repo fix --publish`.
