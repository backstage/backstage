---
'@backstage/plugin-scaffolder-node': minor
---

**BREAKING** - Marking optional fields as required in the `TaskBroker`, these can be fixed with a no-op `() => void` if you don't want to implement the functions.

- `cancel`, `recoverTasks` and `retry` are the required methods on the `TaskBroker` interface.

**NOTE**: If you're affected by this breaking change, please reach out to us in an issue as we're thinking about completely removing the `TaskBroker` extension point soon and would like to hear your use cases for the upcoming re-architecture of the `scaffolder-backend` plugin.
