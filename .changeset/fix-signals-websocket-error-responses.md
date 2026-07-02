---
'@backstage/plugin-signals-backend': patch
---

Fixed WebSocket upgrade error responses to use correct HTTP headers, preventing load balancers from reporting 502 errors when authentication fails. Error responses no longer include `Upgrade` and `Connection: Upgrade` headers (which are only valid for 101 responses), and use `socket.end()` instead of `socket.destroy()` to ensure the response is fully flushed before closing the connection.
