---
'@backstage/create-app': patch
---

Removed remove-plugin from package.json scripts when creating a new app. The remove-plugin command has been removed from backstage-cli and resulted in an error when called.
