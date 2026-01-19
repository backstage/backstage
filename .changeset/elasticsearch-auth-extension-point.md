---
'@backstage/plugin-search-backend-module-elasticsearch': minor
---

Added `elasticsearchAuthExtensionPoint` to enable dynamic authentication mechanisms such as bearer tokens with automatic rotation.

This extension point allows adopters to provide custom auth providers that inject headers per-request, enabling:

- Bearer token authentication
- Automatic token rotation
- Integration with corporate identity providers

**Example usage:**

```typescript
import { createBackendModule } from '@backstage/backend-plugin-api';
import { elasticsearchAuthExtensionPoint } from '@backstage/plugin-search-backend-module-elasticsearch';

export default createBackendModule({
  pluginId: 'search',
  moduleId: 'elasticsearch-custom-auth',
  register(env) {
    env.registerInit({
      deps: {
        elasticsearchAuth: elasticsearchAuthExtensionPoint,
      },
      async init({ elasticsearchAuth }) {
        elasticsearchAuth.setAuthProvider({
          async getAuthHeaders() {
            const token = await myTokenService.getToken();
            return { Authorization: `Bearer ${token}` };
          },
        });
      },
    });
  },
});
```

The auth provider takes precedence over static auth config when set. Note: AWS provider (SigV4) does not support custom auth providers.
