---
id: fossa
title: FOSSA connections
description: Configure and consume FOSSA connections
---

Use a `fossa` connection for authenticated FOSSA API requests.

## Configuring

### Configure an API token

Create a [Full API token](https://docs.fossa.com/docs/organization-management/api-tokens)
for a user or service account with access to the organization data you need.
Push-Only tokens cannot perform most reads. Use `Authorization: Bearer ...`,
as described in [API authentication](https://docs.fossa.com/docs/api/authentication).

```yaml title="app-config.yaml"
connections:
  - type: fossa
    baseUrl: https://app.fossa.com/
    auth:
      - method: token
        token: ${FOSSA_TOKEN}
```

### Choose request addresses

Set `baseUrl` to `https://app.fossa.com/` or your on-premises installation root,
including any installation path. The example appends `api/` unless you set
`apiBaseUrl` to another API root, such as
`http://fossa.internal:8080/fossa/api/`.

FOSSA checks which organizations the token can access. Organization or project
paths cannot select a separate token on the same host; use
[plugin-scoped tokens](../01-concepts.md#plugin-scoping) when different plugins
need different organization access.

See the shared [lookup and credential selection rules](../01-concepts.md#what-happens-during-find).

## Consuming

### List accessible organizations

[Declare a connection dependency](../03-consuming-connections.md#declare-and-resolve-the-connection)
and request `token` authentication. Pass your FOSSA installation URL to this
function. The example reads one response page; follow the provider's pagination
contract when you need the complete result.

```ts
import type { ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';

export async function readFossaOrganizations(
  connections: ConnectionsService,
  instanceUrl: string,
) {
  const connection = await connections.find({
    type: 'fossa',
    query: { url: instanceUrl },
    authMethods: ['token'],
  });
  const apiRoot = connection.apiBaseUrl ?? new URL('api/', connection.baseUrl);
  const url = new URL('organizations', apiRoot);
  const response = await fetch(url, {
    redirect: 'error',
    headers: { Authorization: `Bearer ${connection.auth.token}` },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}
```

With the configuration above, the request goes to
`https://app.fossa.com/api/organizations`.
