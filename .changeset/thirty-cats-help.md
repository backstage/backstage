---
'@backstage/plugin-catalog-backend': patch
---

Change script in **UrlReaderProcessor.ts** Replacing the line code 127 'const { pathname: filepath } = new URL(location)' with to handle URL Reader from GCS with wildcard \*
