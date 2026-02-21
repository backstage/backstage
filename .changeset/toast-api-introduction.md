---
'@backstage/frontend-plugin-api': patch
'@backstage/plugin-app': patch
---

Introduced a new `ToastApi` for displaying rich toast notifications in the new frontend system.

The new `ToastApi` provides enhanced notification capabilities compared to the existing `AlertApi`:

- **Title and Description**: Toasts support both a title and an optional description
- **Custom Timeouts**: Each toast can specify its own timeout duration
- **Links**: Toasts can include action links
- **Status Variants**: Support for neutral, info, success, warning, and danger statuses
- **Programmatic Dismiss**: Toasts can be dismissed programmatically using the `close()` handle returned from `post()`

**Usage:**

```typescript
import { toastApiRef, useApi } from '@backstage/frontend-plugin-api';

const toastApi = useApi(toastApiRef);

// Full-featured toast
toastApi.post({
  title: 'Entity saved',
  description: 'Your changes have been saved successfully.',
  status: 'success',
  timeout: 5000,
  links: [{ label: 'View entity', href: '/catalog/entity' }],
});

// Programmatic dismiss
const { close } = toastApi.post({ title: 'Uploading...', status: 'info' });
// Later...
close();
```

The `ToastDisplay` component subscribes to both `ToastApi` and `AlertApi`, providing a migration path where both systems work side by side until `AlertApi` is fully deprecated.
