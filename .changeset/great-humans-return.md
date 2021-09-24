---
'@backstage/core-app-api': patch
---

Store additional, late registered and lazy loaded APIs in the registry as well.
Route paths, route objects and others are collected already on late registration, this adds APIs to be collected also.
Enables late registration of plugins into the application and updates ApiHolder when additional plugins have been added in.
