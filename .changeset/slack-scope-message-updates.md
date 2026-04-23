---
'@backstage/plugin-notifications-backend-module-slack': patch
---

Added scope-based message update support. When a notification is re-sent with the same `scope` and `notification.updated` is set, the processor now calls `chat.update()` on the existing Slack message instead of sending a duplicate via `chat.postMessage()`. Message timestamps are persisted in a new `slack_message_timestamps` database table with automatic daily cleanup. The processor gracefully degrades to the previous behavior when no database is provided.
