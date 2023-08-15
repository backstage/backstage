---
'@backstage/plugin-scaffolder-backend': patch
---

Removed the options from the alpha `scaffolderPlugin` export. To extend the scaffolder plugin you instead now use the available extension points, `scaffolderActionsExtensionPoint`, `scaffolderTaskBrokerExtensionPoint`, and `scaffolderTemplatingExtensionPoint`.
