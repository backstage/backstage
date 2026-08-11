---
'@backstage/create-app': patch
---

Added a GitHub Actions CI workflow to the default app template. New Backstage instances created with `create-app` now include a `.github/workflows/ci.yml` that runs lint, type checking, tests, configuration validation, and a Docker image build on every pull request.
