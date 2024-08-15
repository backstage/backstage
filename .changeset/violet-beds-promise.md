---
'@backstage/core-components': patch
'@backstage/plugin-auth-backend': patch
'@backstage/plugin-auth-node': patch
'@backstage/plugin-auth-react': patch
---

Fix authentication error handling using redirect flow via `enableExperimentalRedirectFlow` config. If an error is caught during authentication, the user is redirected back to app origin with `?error=true` query parameter. A cookie is also set in the redirect which contains the error message. The error can be fetched from any custom sign in page using the new `useSignInAuthError` hook.:

```ts
import { useSignInAuthError } from '@backstage/plugin-auth-react';

const { error, checkAuthError } = useSignInAuthError();
```
