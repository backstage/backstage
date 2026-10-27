---
'@backstage/backend-defaults': patch
---

Support exact-path WebSocket upgrade routing from the first connection, reject unmatched upgrades, and close upgraded sockets during backend shutdown. Authenticate plugin upgrades before dispatch by trying the Authorization bearer token and then each offered protocol value. Support the same default, cookie, and unauthenticated policies as HTTP routes, with origin checks for cookie authentication. Plugin upgrades follow the HTTP startup timeout and reject during plugin shutdown. HTTP middleware and path-based auth policies do not apply to upgrades.

Once a WebSocket route is registered, existing workarounds using direct server upgrade listeners or Express upgrade handling must migrate to the new routing API.

Custom HTTP router service implementations can delegate WebSocket registration through `createWebSocketRouter` from `@backstage/backend-defaults/httpRouter`.
