---
'@backstage/plugin-auth-node': minor
---

**BREAKING**: Sign-in resolver factory option schemas now use Standard Schema and Standard JSON Schema instead of Zod v3. When using Zod, provide a schema from the full Zod v4 package by importing from `zod`; Zod v3 schemas and the `zod/v4` compatibility export from a Zod v3 installation are not supported because they cannot provide the required JSON Schema metadata. Other schema libraries can be used when they implement both standards and validate synchronously.
