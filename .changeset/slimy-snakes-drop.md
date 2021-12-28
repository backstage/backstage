---
'@backstage/create-app': patch
---

Add a `scheduler` to the plugin environment, which can schedule collaborative tasks across backends. To apply the same change in your backend, follow the steps below.

First install the package:

```shell
# From the Backstage repository root
cd packages/backend
yarn add @backstage/backend-tasks
```

Add the scheduler to your plugin environment type:

```diff
 // In packages/backend/src/types.ts
+import { PluginTaskScheduler } from '@backstage/backend-tasks';

 export type PluginEnvironment = {
+  scheduler: PluginTaskScheduler;
```

And finally make sure to add such an instance to each plugin's environment:

```diff
 // In packages/backend/src/index.ts
+import { TaskScheduler } from '@backstage/backend-tasks';

 function makeCreateEnv(config: Config) {
   // ...
+  const taskScheduler = TaskScheduler.fromConfig(config);

   return (plugin: string): PluginEnvironment => {
     // ...
+    const scheduler = taskScheduler.forPlugin(plugin);
     return {
+      scheduler,
       // ...
```
