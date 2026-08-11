---
'@backstage/cli-module-new': patch
---

Added a new `permission-policy-module` template for scaffolding custom permission policies via `backstage-cli new`. The template generates a backend module that wires a `PermissionPolicy` implementation into the permission backend using the `policyExtensionPoint`, along with a test example.
