---
'@backstage/cli': patch
---

Several changes were made to the new experimental package roles system. Unless you have been experimenting with using this new system, these changes have no affect on your project.

Renamed the `backstage-cli migrate package-role` command to `backstage-cli migrate package-roles`.

Updated the package role definitions by renaming `app` to `frontend`, `plugin-frontend` to `frontend-plugin`, `plugin-frontend-module` to `frontend-plugin-module`, `plugin-backend` to `backend-plugin`, and `plugin-backend-module` to `backend-plugin-module`

The `backstage-cli migrate package-scripts` received several tweaks to make it more accurate. It now tries to maintain existing script arguments, like `--config` parameters for `build` and `start` scripts.

The `script` command category has been renamed to `package`.

The `backstage-cli package build` command set an incorrect target directory for `app` and `backend` packages, which has been fixed.
