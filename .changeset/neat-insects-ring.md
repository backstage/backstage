---
'@backstage/plugin-techdocs': patch
---

Add the techdocs.sanitizer.allowedIframeHosts config.
This config allows all iframes which have the host of the attribute src in the 'allowedIframehosts' list to be displayed in the documentation.
