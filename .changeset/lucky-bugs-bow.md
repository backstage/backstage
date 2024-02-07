---
'@backstage/create-app': patch
---

Add a seed file for `yarn.lock` in newly created apps. This file is downloaded directly from `https://github.com/backstage/backstage` at the time of creating a new project, ensuring that users always receive the latest version. The purpose of the seed file is to initialize the lock file with known good versions of individual dependencies that have had bad new releases published. The seed file will have no effect if the dependency is not present, it can not be used to install additional packages.
