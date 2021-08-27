---
'@backstage/core-app-api': patch
---

Store additional, late registered and lazy loaded APIs in the registry as well.
Route paths, route objs and others are collected already on late reg, this adds APIs to be collected also.
Enables late registration of plugins into the application and updates ApiHolder when additional plugins have been added in.
