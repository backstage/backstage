---
'@backstage/plugin-app': patch
---

Updated the default app root to better support phased app preparation by allowing the app layout to be absent during bootstrap, routing bootstrap failures through the app root boundary, and avoiding installation of a guest identity in protected apps that do not provide a sign-in page.
