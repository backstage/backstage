---
'@backstage/plugin-todo-backend': patch
---

Add support to exclude certain folders in `todo` plugin.

You can add function by configuring your own exclusion logic, for example:

```ts
import {
  TodoScmReader,
  createTodoParser,
} from '@backstage/plugin-todo-backend';

// ...

const todoReader = TodoScmReader.fromConfig(config, {
  logger,
  reader,
  filePathFilter: (filePath: string): boolean => {
      ...
      YOUR LOGIC HERE
  },
});
```
