---
id: watch
title: Watching Kubernetes Resources
sidebar_label: Watch
description: Streaming real-time Kubernetes resource changes in Backstage plugins
---

The Kubernetes backend plugin provides a `watchResource()` method on the
`KubernetesFetcher` interface that lets plugin authors stream resource changes
from the Kubernetes API in real time. This is the watch counterpart to the
existing `get` and `list` operations and follows the same error handling
patterns.

## How it works

The method opens a long-lived HTTP connection to the Kubernetes API with
`?watch=true` and yields events as an
[async iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of).
Each event represents a single change (creation, modification, or deletion) to a
resource in the cluster.

The stream processing pipeline is:

1. HTTP GET with `?watch=true` opens a streaming connection.
2. The response body is piped through a line-delimited JSON parser.
3. Each line is parsed and transformed into a `KubernetesWatchEvent`.
4. Events are yielded to the caller via the async generator.

## Usage

```typescript
import { KubernetesClientBasedFetcher } from '@backstage/plugin-kubernetes-backend';

const fetcher = new KubernetesClientBasedFetcher({ logger });

for await (const event of fetcher.watchResource(
  {
    clusterDetails,
    credential,
    group: '', // empty string for core API group
    apiVersion: 'v1',
    plural: 'pods',
  },
  { namespace: 'default', labelSelector: 'app=myapp' },
)) {
  if (event.type === 'ERROR') {
    logger.error(`Watch error: ${event.error.errorType}`);
    break;
  }

  const obj = event.object as any;
  logger.info(`${event.type}: ${obj.metadata.name}`);
}
```

## Event types

The Kubernetes API sends the following event types, all of which are supported:

| Event type | Description                                                     |
| ---------- | --------------------------------------------------------------- |
| `ADDED`    | A resource was created or already exists at watch start.        |
| `MODIFIED` | A resource was updated.                                         |
| `DELETED`  | A resource was removed.                                         |
| `BOOKMARK` | A checkpoint for the current resource version (minimal object). |
| `ERROR`    | An error occurred, such as an expired resource version.         |

`ADDED`, `MODIFIED`, and `DELETED` events include the full Kubernetes object in
the `object` field and the resource version in the `resourceVersion` field.
`BOOKMARK` events include a minimal object (typically just
`metadata.resourceVersion`). `ERROR` events contain a structured
`KubernetesFetchError` with an `errorType` and `statusCode`.

## Watch options

The `KubernetesWatchOptions` interface supports the following parameters:

| Option                 | Type          | Description                                                                                                                                                       |
| ---------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `namespace`            | `string`      | Namespace to watch (omit for cluster-scoped resources).                                                                                                           |
| `labelSelector`        | `string`      | Label selector to filter resources.                                                                                                                               |
| `resourceVersion`      | `string`      | Resource version to start watching from.                                                                                                                          |
| `timeoutSeconds`       | `number`      | Server-side timeout for the watch connection.                                                                                                                     |
| `allowWatchBookmarks`  | `boolean`     | Enable bookmark events for efficient version tracking.                                                                                                            |
| `sendInitialEvents`    | `boolean`     | Begin the stream with synthetic events reproducing current state, ending with a bookmark annotated `k8s.io/initial-events-end`. Requires Kubernetes 1.32+ (Beta). |
| `resourceVersionMatch` | `string`      | How the resource version constraint is applied. Set to `NotOlderThan` when using `sendInitialEvents` so the server can serve from its watch cache.                |
| `signal`               | `AbortSignal` | Abort signal to cancel the watch from outside the iteration loop.                                                                                                 |

## Watching custom resources

To watch custom resources, provide the API group, version, and plural name:

```typescript
for await (const event of fetcher.watchResource(
  {
    clusterDetails,
    credential,
    group: 'apps',
    apiVersion: 'v1',
    plural: 'deployments',
  },
  { namespace: 'production' },
)) {
  // handle events
}
```

## Error handling

The watch method follows the same errors-as-data pattern used by the existing
`get` and `list` operations. Errors are yielded as events rather than thrown as
exceptions, so consumers handle them in the same `for await` loop.

There are three categories of errors:

- **HTTP errors** (e.g., 401 Unauthorized, 404 Not Found): The method yields a
  single `ERROR` event and stops. The error type is mapped using the same status
  code mapping as `get`/`list` operations.
- **Stream errors** from the Kubernetes API (e.g., 410 Gone for an expired
  resource version): These arrive as `ERROR`-type events in the stream and are
  yielded to the consumer.
- **Malformed JSON**: Invalid lines are logged and skipped without interrupting
  the stream.

## Authentication

The watch method reuses the same authentication mechanisms as the rest of the
Kubernetes backend plugin. All configured auth providers (bearer token, x509
client certificates, service account, OIDC, etc.) work with watch connections.

## Cancellation

To stop a watch from outside the iteration loop, pass an `AbortSignal`:

```typescript
const controller = new AbortController();

// Cancel the watch after 30 seconds
setTimeout(() => controller.abort(), 30_000);

for await (const event of fetcher.watchResource(
  {
    clusterDetails,
    credential,
    group: '',
    apiVersion: 'v1',
    plural: 'pods',
  },
  { namespace: 'default', signal: controller.signal },
)) {
  // handle events — loop ends cleanly when signal fires
}
```

Breaking out of the `for await` loop also stops the watch and cleans up the
underlying HTTP connection.

## Limitations

- **No automatic reconnection.** When a watch connection ends (due to timeout,
  network error, or server-side disconnect), the consumer is responsible for
  reconnecting. Use the `resourceVersion` from the last received event to resume
  without missing changes.
- **No informer behavior.** This is a low-level watch primitive. It does not
  maintain a local cache, perform automatic list-watch initialization, or handle
  periodic resynchronization. These higher-level patterns can be built on top of the watch
  API.
- **Single resource type per call.** Each `watchResource()` call watches one
  resource type. To watch multiple resource types, make separate calls.
