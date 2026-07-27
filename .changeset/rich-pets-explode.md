---
'@backstage/create-app': patch
---

Added a prerequisites check when creating a new app that validates Node.js LTS version and Yarn availability before proceeding, and warns if Python is not found.
