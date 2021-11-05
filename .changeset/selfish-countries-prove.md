---
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-scaffolder-backend': patch
---

Adds a new endpoint for consuming logs from the Scaffolder that uses long polling instead of Server Sent Events.

This is useful if Backstage is accessed from an environment that doesn't support SSE correctly, which happens in combination with certain enterprise HTTP Proxy servers.

It is intended to switch the endpoint globally for the whole instance.
If you want to use it, you can provide a reconfigured API to the `scaffolderApiRef`:

```tsx
// packages/app/src/apis.ts

// ...
import {
  scaffolderApiRef,
  ScaffolderClient,
} from '@backstage/plugin-scaffolder';

export const apis: AnyApiFactory[] = [
  // ...

  createApiFactory({
    api: scaffolderApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      identityApi: identityApiRef,
      scmIntegrationsApi: scmIntegrationsApiRef,
    },
    factory: ({ discoveryApi, identityApi, scmIntegrationsApi }) =>
      new ScaffolderClient({
        discoveryApi,
        identityApi,
        scmIntegrationsApi,
        // use long polling instead of an eventsource
        useLongPollingLogs: true,
      }),
  }),
];
```
