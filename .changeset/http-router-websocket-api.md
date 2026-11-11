---
'@backstage/backend-plugin-api': minor
---

Add WebSocket upgrade routes to the HTTP router services. Routes require token authentication by default. The `unauthenticated` override leaves authentication to the handler. Cookie authentication is not supported. Browser clients can pass bearer tokens through the WebSocket protocol header.

```ts
httpRouter.addWebSocketHandler({
  path: '/events',
  handler({ request, socket, head }) {
    webSocketServer.handleUpgrade(request, socket, head, connection => {
      webSocketServer.emit('connection', connection, request);
    });
  },
});
```

**BREAKING PRODUCERS**: Custom implementations of `HttpRouterService` and `RootHttpRouterService` must implement `addWebSocketHandler`.
