---
'@backstage/create-app': patch
---

Updated the auth backend setup in the template to include a guest sign-in resolver in order to make it quicker to get up and running with a basic sign-in setup. There is no need to update existing apps to match this change, but in case you want to use the guest sign-in resolver you can find it at https://backstage.io/docs/auth/identity-resolver#guest-sign-in-resolver
