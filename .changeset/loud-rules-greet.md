---
'@backstage/plugin-signals-backend': patch
'@backstage/plugin-signals-node': patch
---

Improve signals event subscriptions by utilizing the channel.

This lowers the number of unnecessary message sending between nodes if there are no subscriptions
to specific channel in the specific node. Previously all nodes subscribed to global `signals`
topic and received messages for all channels even they did not have any client interested in those.
