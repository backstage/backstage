---
'@backstage/core-components': patch
'@backstage/core-plugin-api': patch
'@backstage/app-defaults': patch
'@backstage/core-app-api': patch
'@backstage/plugin-auth-backend': patch
'@backstage/plugin-auth-node': patch
---

Fix error handling using authentication redirect flow via `enableExperimentalRedirectFlow` config. If an error is caught during authentication, the user is redirected back to app origin with `?error=true` query parameter. A cookie is also set in the redirect which contains the error message. The error can be fetched from any custom sign in page using the new `AuthErrorApi` and `getSignInError()` implementation. Example:

```ts
import { useApi, authErrorApiRef } from '@backstage/core-plugin-api';

const authErrorApi = useApi(authErrorApiRef);
const errorResponse = await authErrorApi.getSignInAuthError();
```
