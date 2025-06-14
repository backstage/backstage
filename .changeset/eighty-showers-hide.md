---
'@backstage/plugin-scaffolder-node-test-utils': minor
---

**BREAKING CHANGES**

Because of the removal of the `logStream` property to the `ActionsContext` this has been removed from the `createMockActionContext` method.

You can remove this as it's no longer supported in the scaffolder actions.
