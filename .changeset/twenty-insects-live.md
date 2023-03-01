---
'@backstage/plugin-proxy-backend': patch
---

Pass the current log level to `http-proxy-middleware` to ensure that proxies requests are shown when log level is set to `debug`.
