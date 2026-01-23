---
'@backstage/plugin-signals': patch
---

Improved signals client handling of multiple subscriptions at the same time.

When multiple subscriptions are requested at the same time, signals client
starts multiple connections where the last one will actually send the subscription
messages to the backend. This fixes it by wrapping the connect method inside
a stored promise that is used for subscription calls.
