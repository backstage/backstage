---
'@backstage/cli-node': patch
---

Ensure CLI commands finish writing their output before exiting, so large responses remain complete when stdout is piped.
