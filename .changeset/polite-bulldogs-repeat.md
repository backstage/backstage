---
'@backstage/cli': patch
---

Several changes were made to the new experimental package roles system. Unless you have been experimenting with using this new system, these changes have no affect on your project.

Renamed the `backstage-cli migrate package-role` command to `backstage-cli migrate package-roles`.

Updated the package role definitions by renaming `plugin-frontend` to `frontend-plugin`, as well as the same reshuffle to `frontend-plugin-module`, `backend-plugin`, and `backend-plugin-module`.

The `backstage-cli migrate package-scripts` received several tweaks to make it more accurate. It now tries to maintain existing script arguments, like `--config` parameters for `build` and `start` scripts.
