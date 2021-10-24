# @backstage/backend-tasks

Common distributed task management / locking library for Backstage backends.

## Usage

Add the library to your backend package:

```sh
# From your Backstage root directory
cd packages/backend
yarn add @backstage/backend-tasks
```

then make use of its facilities as necessary:

```typescript
import { TaskManager } from '@backstage/backend-tasks';

const manager = TaskManager.fromConfig(rootConfig).forPlugin('my-plugin');

const { unschedule } = await manager.scheduleTask(
  'refresh-things',
  {
    frequency: Duration.fromObject({ minutes: 10 }),
  },
  async () => {
    await entityProvider.run();
  },
);
```

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://github.com/backstage/backstage/blob/master/docs/README.md)
