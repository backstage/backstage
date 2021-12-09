---
'@backstage/cli': patch
---

Updated the frontend plugin template to put React dependencies in `peerDependencies` by default, as well as allowing both React v16 and v17. This change can be applied to existing plugins by running `yarn backstage-cli plugin:diff` within the plugin package directory.
