# signals

Welcome to the signals backend plugin!

Signals plugin allows backend plugins to publish messages to frontend plugins.

## Getting started

To install this signals backend plugin, please refer the [Getting Started](https://backstage.io/docs/notifications) Backstage Notifications and Signals documentation section.

## WebSocket authentication

The signals WebSocket endpoint requires a Backstage user token. The bundled
signals client sends the token in the `Sec-WebSocket-Protocol` header. Custom
clients can include the token alongside other protocol values; the backend
tries each value until one authenticates and selects that token for the WebSocket
handshake. The signals handler then requires user credentials.
Connections without a valid user token are rejected.
