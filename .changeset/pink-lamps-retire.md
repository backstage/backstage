---
'@backstage/core-components': patch
---

Stop clearing the selected provider from `localStorage` when a sign-in loader is cancelled. Only clear it when the loader actually fails. Memoize `getSignInProviders` so it does not recreate the providers object on every render.
