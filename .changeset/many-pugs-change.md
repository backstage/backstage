---
'@backstage/plugin-kubernetes-backend': patch
---

Change add some lines in the script GkeClusterLocator.ts, the implementation consist in adding a piece of code starts in 58 adding some config.getString() method to find out if the app-config.yaml kubernetes config includes the type of Auth as googleServiceAccount
