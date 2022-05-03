---
'@backstage/create-app': patch
---

Simplified the search collator scheduling by removing the need for the `luxon` dependency.

For existing installations the scheduling can be simplified by removing the `luxon` dependency and using the human friendly duration object instead.
Please note that this only applies if luxon is not used elsewhere in your installation.

`packages/backend/package.json`

```diff
     "express": "^4.17.1",
     "express-promise-router": "^4.1.0",
-    "luxon": "^2.0.2",
```

`packages/backend/src/plugins/search.ts`

```diff
 import { Router } from 'express';
-import { Duration } from 'luxon';

 // omitted other code

   const schedule = env.scheduler.createScheduledTaskRunner({
-    frequency: Duration.fromObject({ minutes: 10 }),
-    timeout: Duration.fromObject({ minutes: 15 }),
+    frequency: { minutes: 10 },
+    timeout: { minutes: 15 },
     // A 3 second delay gives the backend server a chance to initialize before
     // any collators are executed, which may attempt requests against the API.
-    initialDelay: Duration.fromObject({ seconds: 3 }),
+    initialDelay: { seconds: 3 },
   });
```
