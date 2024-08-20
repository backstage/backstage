# @backstage/backend-tasks

> [!CAUTION]
> This package is deprecated and will be removed in a near future.

Common distributed task management for Backstage backends.

## Usage

> [!CAUTION]
> Please note that the documentation below is only valid for versions equal to or below `0.5.28-next.3`.
> As this package will be deleted soon, we recommend that you migrate to the new backend system, and depend on `coreServices.scheduler` from `@backstage/backend-plugin-api` instead, or use `DefaultSchedulerService` from `@backstage/backend-defaults`. Here are the [backend](https://backstage.io/docs/backend-system/building-backends/migrating) and [plugin](https://backstage.io/docs/backend-system/building-plugins-and-modules/migrating) migration guides.

Add the library to your backend package:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/backend-tasks
```

then make use of its facilities as necessary:

```typescript
import { TaskScheduler } from '@backstage/backend-tasks';

const scheduler = TaskScheduler.fromConfig(rootConfig).forPlugin('my-plugin');

await scheduler.scheduleTask({
  id: 'refresh_things',
  frequency: { cron: '*/5 * * * *' }, // every 5 minutes, also supports Duration
  timeout: { minutes: 15 },
  fn: async () => {
    await entityProvider.run();
  },
});
```
