---
'@backstage/plugin-kubernetes-backend': minor
---

**BREAKING** The backend will fail to start if two clusters in the app-config
have the same name. The requirement for unique names has been declared in the
docs for some time, but is now enforced.
