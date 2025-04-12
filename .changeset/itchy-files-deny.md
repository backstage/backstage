---
'@backstage/backend-defaults': patch
---

Implemented SRV lookup support in the default `HostDiscovery`. You can now specify internal URLs on the form `http+srv://some-srv-name/api/{{pluginId}}` and they will be resolved in real time.
