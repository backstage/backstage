---
'@backstage/connections-node': patch
---

Connections read from configuration are now checked against the connection type's whole-connection validation rules, rejecting invalid connections at startup.
