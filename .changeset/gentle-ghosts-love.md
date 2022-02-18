---
'@backstage/plugin-scaffolder-backend': minor
---

- **BREAKING** - `DatabaseTaskStore()` constructor is now removed. Please use the `DatabaseTaskStore.create()` method instead.

- **BREAKING** - `TaskStore.createTask()` method now only takes one argument of type `TaskStoreCreateTaskOptions` which encapsulates the `spec` and `secrets`

```diff
- TaskStore.createTask(spec, secrets)
+ TaskStore.createTask({ spec, secrets})
```

- **BREAKING** - `TaskBroker.dispatch()` method now only takes one argument of type `TaskBrokerDispatchOptions` which encapsulates the `spec` and `secrets`

```diff
- TaskBroker.dispatch(spec, secrets)
+ TaskBroker.dispatch({ spec, secrets})
```
