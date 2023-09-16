---
'@backstage/create-app': major
'example-backend': major
---

- [#19974](https://github.com/backstage/backstage/issues/19974) Bump Docker base images to "node:18-bullseye-slim" in order to resolve compatiblity issue raised when running `yarn build-image` with Node.JS 16.x. This update follows the Docker CI update to Node 18x [#19563](https://github.com/backstage/backstage/pull/19563).
