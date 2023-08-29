---
'@backstage/backend-app-api': patch
---

Index features on id instead of object.

This will allow features added from an external package location to be loaded correctly,
without the requirement of making backstage packages singletons.
