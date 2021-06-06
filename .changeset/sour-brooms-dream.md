---
'@backstage/cli': patch
---

Fix error message formatting in the packaging process.

error.errors can be undefined which will lead to a TypeError, swallowing the actual error message in the process.

For instance, if you break your tsconfig.json with invalid syntax, backstage-cli will not be able to build anything and it will be very hard to find out why because the underlying error message is hidden behind a TypeError.
