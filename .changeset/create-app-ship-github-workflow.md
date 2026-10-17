---
'@backstage/create-app': patch
---

Fixed new apps missing the `.github/workflows/ci.yml` GitHub Actions workflow. The published package left the template's `.github` directory out, so apps created with `npx @backstage/create-app` never received it.
