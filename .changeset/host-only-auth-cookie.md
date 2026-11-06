---
'@backstage/backend-defaults': patch
---

The `backstage-auth` user cookie is now host-only instead of being scoped to the domain of the backend's external base URL. This stops the cookie from leaking to Backstage instances hosted on subdomains, for example from `example.com` to `uat.example.com`, where it previously caused 401 errors. Cookies issued by earlier versions are not removed, but they expire on their own within the Backstage token lifetime, which is one hour by default.
