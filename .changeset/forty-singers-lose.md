---
'@backstage/plugin-permission-common': patch
'@backstage/plugin-permission-react': patch
'@backstage/plugin-permission-node': patch
---

Allow using `DataLoader` for permission authorize requests.

This feature is experimental and can be enabled with configuration
`permission.EXPERIMENTAL_enableDataloaderRequests`.

Using the `DataLoader` will batch authorize requests to improve permission
framework performance.
