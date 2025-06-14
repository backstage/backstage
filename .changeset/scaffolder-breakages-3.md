---
'@backstage/plugin-scaffolder-backend': major
---

**BREAKING CHANGES**

The following functions have been re-exported from the `scaffolder-backend` plugin for quite some time, and now it's time to clean them up. They've been moved as follows:

- `SerializedTask`, `SerializedTaskEvent`, `TaskBroker`, `TaskBrokerDispatchOptions`, `TaskBrokerDispatchResult`, `TaskCompletionState`, `TaskContext`, `TaskEventType`, `TaskStatus`, `TemplateFilter`, and `TemplateGlobal` should be imported from `@backstage/plugin-scaffolder-node` instead.

- The deprecated `copyWithoutRender` option has been removed from `fetch:template` action. You should rename the option to `copyWithoutTemplating` instead.
