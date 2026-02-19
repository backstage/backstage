---
'@backstage/integration': minor
---

**BREAKING**: `DefaultAzureCredentialsManager` must now be imported from `@backstage/integration/backend` instead of `@backstage/integration`. This change isolates backend-only code with Node.js dependencies from frontend bundles.

**Migration:** Update your imports:

```typescript
// Before:
import { DefaultAzureCredentialsManager } from '@backstage/integration';

// After:
import { DefaultAzureCredentialsManager } from '@backstage/integration/backend';
```

Enhanced `AzureCredentialsManager` to properly support all Azure Blob Storage authentication methods (account key, SAS token, and Azure AD). Added `getServiceUrl()` method to the interface, allowing third-party plugins to leverage the credentials manager for complete Azure Blob Storage integration. The `DefaultAzureCredentialsManager` now correctly returns `StorageSharedKeyCredential` for account key authentication and `AnonymousCredential` for SAS token authentication, in addition to the existing `TokenCredential` support.
