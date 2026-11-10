---
'@backstage/cli-module-new': patch
---

Updated the new frontend plugin template to provide an internal Todo API whose
client implementation loads on demand. Generated pages consume the API instead
of fetching directly, and generated tests install the plugin's API factories.
