---
'@backstage/core-app-api': patch
---

Asynchronous methods on the identity API can now reliably be called at any time, including early in the bootstrap process or prior to successful sign-in.

Previously in such situations, a `Tried to access IdentityApi before app was loaded` error would be thrown. Now, those methods will wait and resolve eventually (as soon as a concrete identity API is provided).
