---
'@backstage/backend-tasks': patch
---

`TaskScheduleDefinition` has been updated to also accept an options object containing duration information in the form of days, hours, seconds and so on. This allows for scheduling without importing `luxon`.

```diff
-import { Duration } from 'luxon';
// omitted other code

const schedule = env.scheduler.createScheduledTaskRunner({
-  frequency: Duration.fromObject({ minutes: 10 }),
-  timeout: Duration.fromObject({ minutes: 15 }),
+  frequency: { minutes: 10 },
+  timeout: { minutes: 15 },
   // omitted other code
});
```
