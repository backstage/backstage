---
'@backstage/frontend-plugin-api': patch
'@backstage/core-plugin-api': patch
'@backstage/core-app-api': patch
---

Deprecated `AlertApi` in favor of the new `ToastApi`.

`AlertApi` is now deprecated and will be removed in a future release. Please migrate to `ToastApi` which provides richer notification features.

**Why migrate?**

`ToastApi` offers enhanced capabilities over `AlertApi`:

- **Title and Description**: Display a prominent title with optional description text
- **Action Links**: Include clickable links within notifications
- **Status Variants**: Support for neutral, info, success, warning, and danger statuses
- **Per-toast Timeout**: Control auto-dismiss timing for each notification individually
- **Programmatic Dismiss**: Close notifications via the key returned from `post()`

**Migration Guide**

| AlertApi                                     | ToastApi                                    |
| -------------------------------------------- | ------------------------------------------- |
| `message: string`                            | `title: ReactNode`                          |
| `severity: 'error'`                          | `status: 'danger'`                          |
| `severity: 'success' \| 'info' \| 'warning'` | `status: 'success' \| 'info' \| 'warning'`  |
| `display: 'transient'`                       | `timeout: 5000` (or custom ms)              |
| `display: 'permanent'`                       | omit `timeout`                              |
| `post()` returns `void`                      | `post()` returns `string` (key for dismiss) |

**Example Migration**

```typescript
// Before (AlertApi)
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

const alertApi = useApi(alertApiRef);
alertApi.post({
  message: 'Entity saved successfully',
  severity: 'success',
  display: 'transient',
});

// After (ToastApi)
import { toastApiRef, useApi } from '@backstage/frontend-plugin-api';

const toastApi = useApi(toastApiRef);
toastApi.post({
  title: 'Entity saved successfully',
  status: 'success',
  timeout: 5000,
});
```

**Note**: During the migration period, both APIs work simultaneously. The `ToastDisplay` component subscribes to both `AlertApi` and `ToastApi`, so existing code continues to work while you migrate incrementally.
