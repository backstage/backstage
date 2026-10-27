---
'@backstage/backend-plugin-api': minor
---

Add WebSocket upgrade routes to the HTTP router services. Routes use the same authentication policies as HTTP routes: authenticated by default, with `user-cookie` and `unauthenticated` overrides. Browser clients can pass bearer tokens through the WebSocket protocol header.

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
