---
'@backstage/cli-module-build': patch
---

Fixed a bug where plugin packages installed through feature discovery were loaded before the app's own code ran. This could cause bootstrap-order-sensitive setup code in the app, such as configuring MUI 5's class name prefix, to be skipped if a discovered plugin's dependencies loaded MUI 5 components first. Discovered plugin packages are now loaded after the app's own code instead.
