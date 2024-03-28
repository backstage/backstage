---
'@backstage/core-components': minor
'@backstage/core-plugin-api': minor
'@backstage/app-defaults': minor
'@backstage/core-app-api': minor
'@backstage/plugin-techdocs': minor
---

The NotFoundErrorPage properties within the App component will now function as the default error page throughout all sections of the backstage when a resource cannot be found. Previously, a hardcoded page was employed for this purpose, accompanied by micdrop. With this enhancement, downstream users gain the freedom to create and employ their own error pages, ensuring uniformity in error management across various scenarios.
