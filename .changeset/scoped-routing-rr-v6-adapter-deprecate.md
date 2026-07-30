---
'@backstage/plugin-react-router-v6-adapter': major
---

Removes this package from the public adapter story. The React Router v6 default page router now lives inside `@backstage/plugin-app` (`plugins/app/src/routing/reactRouterV6`) and is registered as the silent app default. This package is retained only as a private tombstone and should not be depended on.
