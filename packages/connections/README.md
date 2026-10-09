## Connections

Shared connection types and schemas for Backstage, providing a common foundation
for integrations and plugins that connect to external services.

Connections is experimental. Its configuration and APIs can change during
experimental development. Backend plugins import `declareConnection` and
`connectionsServiceRef` from `@backstage/backend-plugin-api/alpha`; they should
not depend on the private `@backstage/connections-node` implementation.

- [Configure connections](https://backstage.io/docs/next/backend-system/core-services/connections/configuring-connections)
- [Consume connections in a backend plugin](https://backstage.io/docs/next/backend-system/core-services/connections/consuming-connections)
- [Connection concepts and limitations](https://backstage.io/docs/next/backend-system/core-services/connections/concepts)

Connections provides static configuration and authentication material, not
credential exchange or refresh. Existing plugins must explicitly adopt the
connections service; adding connection configuration does not migrate them.

For the design proposal, see [BEP-14](https://github.com/backstage/backstage/pull/33921).
