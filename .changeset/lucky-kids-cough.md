---
'@backstage/plugin-catalog': patch
---

fixes bug where after unregistering an entity you are redirected to "/". Adds an optional externalRoute "unregisterRedirect" into the catalog plugin which when bound will be navigated to on successfull removal of an entity. If the external route is not bound it will default to using the catalog rootRouteRef "/catalog".
