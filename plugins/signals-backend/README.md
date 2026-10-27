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

The backend registers its upgrade route during initialization through the HTTP
router service. WebSocket connections work as the first request to the backend,
without a preceding health check. The router uses its default authentication policy, and the signals handler
requires user credentials. Service credentials and limited user cookies are not accepted. For custom
clients, put the user token first in the protocol list. The health endpoint stays
public, while HTTP routes outside `/health` retain the default authentication
policy.
