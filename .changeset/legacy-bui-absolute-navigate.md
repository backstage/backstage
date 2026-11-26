---
'@backstage/core-app-api': patch
'@backstage/plugin-app': patch
---

The legacy React Aria router bridge now leaves absolute and protocol-relative link URLs to the browser instead of passing them to React Router's `navigate`. React Aria client-navigates same-origin absolute URLs, and since React Router 6.30.5 those resolved to broken in-app paths such as `/https:/example.com/page`.
