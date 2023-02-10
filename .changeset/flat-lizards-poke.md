---
'@techdocs/cli': patch
---

Fix proxying to mkdocs

The domain localhost may point to both 127.0.0.1 and ::1, ipv4 and ipv6
and when node tries to lookup localhost it might prefer ipv6 while mkdocs
is only listening on ipv4. This tells node-proxy to target the ipv4 address
instead of relying on localhost hostname lookup.
