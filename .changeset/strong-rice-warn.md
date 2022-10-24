---
'@backstage/core-components': patch
'@backstage/core-plugin-api': patch
---

Added an option to allow the `AlertMessage` to be self-closing. This is done with a new `display` property that is set to `transient` on the `AlertMessage`. The length of time that these transient message stay open for can be set using the `transientTimeoutMs` prop on the `AlertDisplay` in the `App.tsx`. Here is an example:

```diff
  const App = () => (
    <AppProvider>
+     <AlertDisplay transientTimeoutMs={2500} />
      <OAuthRequestDialog />
      <AppRouter>
        <Root>{routes}</Root>
      </AppRouter>
    </AppProvider>
  );
```

The above example will set the transient timeout to 2500ms from the default of 5000ms

Here's a rough example of how to trigger an alert using the new `transient` boolean:

```ts
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

const exampleTransient = () => {
  const alertApi = useApi(alertApiRef);
  alertApi.post({
    message: 'Example of Transient Alert',
    severity: 'success',
    display: 'transient',
  });
};
```
