---
'@backstage/plugin-auth-backend': minor
---

**BREAKING** The auth backend now depends on the `ConnectionsService`. Install the service alongside the auth backend:

```ts
import { connectionsServiceFactory } from '@backstage/connections';

backend.add(connectionsServiceFactory);
```
