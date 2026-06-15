---
'@backstage/connections': minor
---

Added the connections package as experimental. A connection is a piece of configuration storing an external host and the credentials required to authenticate with that host. A single connections can be consumed by many plugins, reducing the amount of repeated configuration needed. Connections can have many auth methods which can be restricted to plugins/modules.
