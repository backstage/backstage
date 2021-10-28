# @backstage/backend-tasks

Common distributed task management for Backstage backends.

## Usage

Add the library to your backend package:

```sh
# From your Backstage root directory
cd packages/backend
yarn add @backstage/backend-tasks
```

then make use of its facilities as necessary:

```typescript
import { TaskScheduler } from '@backstage/backend-tasks';
import { Duration } from 'luxon';

const scheduler = TaskScheduler.fromConfig(rootConfig).forPlugin('my-plugin');

await scheduler.scheduleTask({
  id: 'refresh-things',
  frequency: Duration.fromObject({ minutes: 10 }),
  fn: async () => {
    await entityProvider.run();
  },
});
```

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://github.com/backstage/backstage/blob/master/docs/README.md)
