---
'@backstage/backend-dynamic-feature-service': patch
---

This package no longer depends on `@backstage/cli-node`, so that the libraries that the CLI uses to read pnpm lockfiles stay out of backend installs. The `BackstagePackageJson`, `PackageRole`, and `PackagePlatform` types that the API of this package refers to are now exported from it.
