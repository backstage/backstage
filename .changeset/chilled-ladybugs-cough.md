---
'@backstage/core-plugin-api': minor
---

Added a new `display` property to the `AlertMessage` which can accept the values `permanent` or `transient`.

Here's a rough example of how to trigger an alert using the new `display` property:

```ts
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

const ExampleTransient = () => {
  const alertApi = useApi(alertApiRef);
  alertApi.post({
    message: 'Example of Transient Alert',
    severity: 'success',
    display: 'transient',
  });
};
```
