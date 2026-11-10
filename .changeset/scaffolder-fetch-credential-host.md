---
'@backstage/plugin-scaffolder-backend': patch
---

Check the host that relative fetch URLs resolve to when user credentials are required.

When `scaffolder.requireScmUserCredentials` is enabled, the fetch actions now apply the user-credential requirement to the host that the fetch URL resolves to, rather than the host of the template location. This makes the requirement effective also for fetch URLs that are not parseable as absolute URLs on their own.
