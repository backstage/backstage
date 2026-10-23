---
'@backstage/backend-defaults': patch
---

Support exact-path WebSocket upgrade routing from the first connection, reject unmatched upgrades, and close upgraded sockets during backend shutdown. Add an optional `createWebSocketHandler` adapter for managed `ws` handshakes, explicit protocol selection, connection error handling, and cleanup on plugin shutdown. Authenticate plugin upgrades before dispatch by trying the Authorization bearer token and then each offered protocol value. Support per-route user-only, cookie, and unauthenticated policies, with origin checks for cookie authentication. HTTP middleware and path-based auth policies do not apply to upgrades.
