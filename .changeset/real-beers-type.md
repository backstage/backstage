---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

do not creating url location object if file with component definition do not exists in project, that decrease count of request to gitlab with 404 status code
