---
title: Kubernetes Client Watch Support
status: implementable
authors:
  - '@gabemontero'
owners:
  - '@gabemontero'
project-areas:
  - kubernetes
creation-date: 2026-05-06
---

# BEP: Kubernetes Client Watch Support

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
- [Design Details](#design-details)
  - [Watch Event Types](#watch-event-types)
  - [Watch Options](#watch-options)
  - [KubernetesFetcher Interface Extension](#kubernetesfetcher-interface-extension)
  - [Async Iterator API](#async-iterator-api)
  - [Error Handling](#error-handling)
  - [Stream Processing](#stream-processing)
  - [Future: Informer Abstraction](#future-informer-abstraction)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

This BEP proposes adding Kubernetes [watch](https://kubernetes.io/docs/reference/using-api/api-concepts/#efficient-detection-of-changes) support to the Backstage Kubernetes plugin's backend fetcher. Today, every request for Kubernetes state performs a LIST against every relevant cluster. There is no mechanism for streaming incremental updates, tracking resource versions, or receiving real-time change notifications. This proposal adds a `watchResource` method to the `KubernetesFetcher` interface, enabling consumers to open a long-lived streaming connection that receives `ADDED`, `MODIFIED`, `DELETED`, `BOOKMARK`, and `ERROR` events as they occur.

The watch primitive is the foundational building block for higher-level patterns like informers and controllers that the broader Kubernetes ecosystem depends on for scalability and responsiveness. By adding watch support to the Backstage Kubernetes backend, we enable use cases such as live-updating dashboards, event-driven automation, and efficient multi-cluster state synchronization -- all without the cost and latency of repeated LIST calls.

## Motivation

The Backstage Kubernetes plugin currently operates on a purely stateless request-response model: each frontend request triggers a fan-out of HTTP GET (LIST) calls to every relevant cluster, results are aggregated and returned, and nothing is retained. The next request starts from scratch. The only caching in the plugin today is for _cluster metadata_ — which clusters to talk to — not for the Kubernetes objects on those clusters. The frontend `KubernetesBackendClient` added an optional `getClusters()` TTL cache ([PR #34136](https://github.com/backstage/backstage/pull/34136)), and the GKE cluster locator periodically refreshes its cluster list. But neither mechanism reduces the number of LIST calls made to fetch pods, deployments, services, or other resources. No `resourceVersion` tracking, HTTP etag caching, or Backstage cache service integration exists for object data. This architecture has several consequences:

**Scalability concerns.** In the Kubernetes ecosystem, it is a critical best practice to use watches and informers instead of repeated LIST or GET requests. Repeated listing is resource-intensive: the API server must retrieve data from etcd, unmarshal it, and perform conversions for every request. For large objects (such as Secrets with payloads up to 1MB), even a modest number of concurrent LIST calls can cause the API server to exhaust memory and crash. The upstream Kubernetes project has documented this extensively and is actively working to move all clients away from polling-based patterns through [KEP-3157 (Watch-List)](https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/3157-watch-list/README.md), which reached Beta in Kubernetes 1.32.

**No real-time updates.** The current model means Backstage users see a point-in-time snapshot that is stale the moment it arrives. There is no way to receive live notifications when pods crash, deployments roll out, or resources are deleted. Users who need current state must manually refresh, and each refresh incurs the full cost of re-listing.

**Missed events between polls.** Any polling-based approach -- even with short intervals -- can miss events that occur between poll cycles. A pod that is created and terminated between two polls is invisible to the system. Watch connections, by contrast, deliver every state change in order.

**Multi-cluster amplification.** Backstage deployments commonly connect to many clusters. The fan-out pattern means every frontend request multiplies into `N * M` outbound LIST calls (N clusters times M resource types). As noted in the [Kubernetes proxy RFC discussion](https://github.com/backstage/backstage/pull/12231), this fan-out creates situations where "each inbound request results in NM fanned-out requests... It becomes more and more likely that at least one of those requests hangs. The effect on the end user is that every request takes a full 30 seconds."

**Ecosystem alignment.** The Kubernetes ecosystem uniformly uses watches as the foundation for efficient state management:

- The official [Kubernetes JavaScript client](https://github.com/kubernetes-client/javascript) provides `Watch`, `Informer`, and `makeInformer` APIs.
- The Go ecosystem's `client-go` library is built entirely on the informer pattern (SharedInformerFactory, Listers, WorkQueues).
- Kubernetes itself is [migrating its core control-plane components](https://kubernetes.io/blog/2024/12/17/kube-apiserver-api-streaming/) to streaming watch-based LIST operations, with plans to make traditional LIST calls more expensive in API Priority and Fairness once streaming is the default.
- [Community resources](https://medium.com/@dhruvbhl/informers-listers-workqueues-the-brain-behind-your-controller-f5b0967026de) consistently emphasize that informers -- which are built on top of watches -- are the recommended pattern for any long-running application interacting with the Kubernetes API.

No Backstage issue -- open or closed -- was found that proposed adding watch or informer support to the Kubernetes plugin.

### Goals

- Add a `watchResource` method to the `KubernetesFetcher` interface that opens a streaming watch connection to a Kubernetes cluster and yields events as they occur.
- Support all standard Kubernetes watch event types: `ADDED`, `MODIFIED`, `DELETED`, `BOOKMARK`, and `ERROR`.
- Provide a modern TypeScript API using async generators (`AsyncGenerator<KubernetesWatchEvent>`) for natural consumption with `for await...of` loops.
- Reuse the existing authentication and connection infrastructure in `KubernetesClientBasedFetcher` rather than introducing a separate client.
- Handle errors as data (yielded events) rather than thrown exceptions, consistent with the existing pattern where the fetcher returns structured error objects instead of rejecting promises.
- Add the method as a required member of the `KubernetesFetcher` interface. Investigation of the Backstage ecosystem (including `backstage/backstage`, `backstage/community-plugins`, and known deployer repositories) found zero custom `KubernetesFetcher` implementations registered via `kubernetesFetcherExtensionPoint`. The only implementation is the built-in `KubernetesClientBasedFetcher`. Making the method required keeps the interface honest and avoids the complexity of runtime capability checks (`if (fetcher.watchResource)`).
- Lay the foundation for higher-level informer and caching abstractions that can be built on top of the watch primitive in subsequent work.

### Non-Goals

- Building a full informer implementation with local caching, automatic reconnection, resync, and resource version tracking. This is future work that builds on the watch primitive. The watch options do include `sendInitialEvents` and `resourceVersionMatch` from KEP-3157 to support the watch-list streaming pattern on clusters that support it (Kubernetes 1.32+), but higher-level informer logic is deferred to a future phase.
- Modifying the frontend Kubernetes plugin or its React components to consume watch events directly.
- Replacing the existing LIST-based fetch operations. Watch support is additive; existing `fetchObjectsForService` and related methods remain unchanged.
- Implementing WebSocket-based watches. The standard Kubernetes watch API uses chunked HTTP streaming (newline-delimited JSON), not WebSockets.
- Integrating with the upstream `@kubernetes/client-node` Watch or Informer classes. The Backstage Kubernetes plugin uses a custom fetch-based REST client (established in [PR #15250](https://github.com/backstage/backstage/pull/15250)) rather than the SDK's typed API clients, and this proposal extends that same custom client.

## Proposal

Extend the `KubernetesFetcher` interface with a required `watchResource` method that returns an async generator of watch events. The implementation will:

1. Construct the appropriate Kubernetes API watch URL (adding `?watch=true` and any filter parameters).
2. Open an HTTP connection using the same authentication and TLS configuration as existing fetch operations.
3. Parse the response as a stream of newline-delimited JSON objects, each representing a Kubernetes watch event.
4. Yield each parsed event as a typed `KubernetesWatchEvent` to the caller.
5. Handle errors at multiple levels (HTTP status errors, network failures, Kubernetes API errors in the stream, malformed JSON) by yielding structured error events rather than throwing exceptions.
6. Clean up the stream connection when the consumer stops iterating.

The watch method will be implemented in `KubernetesClientBasedFetcher` alongside the existing `fetchResource` method, reusing the same URL construction, authentication setup, and TLS configuration. Stream parsing uses the `split2` library for newline-delimited JSON processing, integrated directly into the `watchResource` async generator.

## Design Details

### Watch Event Types

New types added to `@backstage/plugin-kubernetes-common`:

```typescript
type KubernetesWatchEventType =
  | 'ADDED'
  | 'MODIFIED'
  | 'DELETED'
  | 'BOOKMARK'
  | 'ERROR';

type KubernetesWatchEvent =
  | {
      type: 'ADDED' | 'MODIFIED' | 'DELETED' | 'BOOKMARK';
      object: JsonObject;
    }
  | {
      type: 'ERROR';
      error: {
        errorType: KubernetesErrorTypes;
        statusCode?: number;
        resourcePath?: string;
        message?: string;
      };
    };
```

The discriminated union ensures that consumers can narrow the type based on the `type` field and access either `object` (for resource events) or `error` (for error events) with full type safety.

### Watch Options

```typescript
interface KubernetesWatchOptions {
  /** Watch resources in a specific namespace. Omit for cluster-wide watches. */
  namespace?: string;
  /** Filter resources by label selector (e.g., "app=myapp,env=prod"). */
  labelSelector?: string;
  /** Start watching from a specific resource version. */
  resourceVersion?: string;
  /** Server-side timeout in seconds for the watch connection. */
  timeoutSeconds?: number;
  /** Enable bookmark events for efficient resource version tracking. */
  allowWatchBookmarks?: boolean;
  /**
   * When true, the watch stream begins with synthetic events that reproduce
   * the current state of the collection, followed by a bookmark with the
   * annotation `k8s.io/initial-events-end`. Requires `allowWatchBookmarks`
   * and `resourceVersionMatch` set to `'NotOlderThan'`.
   * See KEP-3157 (watch-list). Supported in Kubernetes 1.32+ (Beta).
   */
  sendInitialEvents?: boolean;
  /**
   * How the resourceVersion constraint is applied. Set to `'NotOlderThan'`
   * when using `sendInitialEvents` so the server can serve from its watch
   * cache rather than quorum-reading etcd.
   */
  resourceVersionMatch?: string;
}
```

### KubernetesFetcher Interface Extension

The `watchResource` method is added as a required member of the existing `KubernetesFetcher` interface in `@backstage/plugin-kubernetes-node`:

```typescript
export interface KubernetesFetcher {
  fetchObjectsForService(
    params: ObjectFetchParams,
  ): Promise<FetchResponseWrapper>;

  fetchPodMetricsByNamespaces(
    clusterDetails: ClusterDetails,
    credential: KubernetesCredential,
    namespaces: Set<string>,
    labelSelector?: string,
  ): Promise<FetchResponseWrapper>;

  /** Opens a streaming watch connection for a Kubernetes resource type. */
  watchResource(
    clusterDetails: ClusterDetails,
    credential: KubernetesCredential,
    group: string,
    apiVersion: string,
    plural: string,
    options?: KubernetesWatchOptions,
  ): AsyncGenerator<KubernetesWatchEvent, void, undefined>;
}
```

The method is required (not optional) because investigation of the Backstage ecosystem found zero custom `KubernetesFetcher` implementations registered via the `kubernetesFetcherExtensionPoint`. The only implementation is the built-in `KubernetesClientBasedFetcher`. Making the method required keeps the interface honest, avoids runtime capability checks, and ensures any future custom fetcher implementations include watch support from the start. Mock implementations in tests need only provide a minimal stub (e.g., an empty async generator).

### Async Iterator API

The async generator pattern was chosen over callbacks, EventEmitter, or RxJS observables for several reasons:

- It is a native TypeScript/JavaScript pattern that works with `for await...of` loops.
- It provides natural backpressure: the producer pauses if the consumer is slow.
- Cleanup is automatic via `finally` blocks when the consumer breaks out of the loop or the generator is garbage collected.
- It composes well with other async patterns and does not require additional dependencies.

Usage example:

```typescript
const fetcher = new KubernetesClientBasedFetcher({ logger });

for await (const event of fetcher.watchResource(
  clusterDetails,
  credential,
  '',
  'v1',
  'pods',
  {
    namespace: 'default',
    labelSelector: 'app=myapp',
    allowWatchBookmarks: true,
  },
)) {
  if (event.type === 'ERROR') {
    logger.error('Watch error', { error: event.error });
    break;
  }
  logger.info(`${event.type}: ${event.object.metadata?.name}`);
}
```

### Error Handling

Consistent with the existing Backstage Kubernetes plugin philosophy established in [PR #15250](https://github.com/backstage/backstage/pull/15250), errors are treated as data rather than exceptions. The original switch from the `@kubernetes/client-node` typed API clients to a custom fetch-based client was motivated primarily by the need for graceful error handling across multi-cluster fan-out operations. The watch implementation follows the same principle:

| Error Source                                                                         | Handling                                                                      |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| HTTP status errors (401, 404, 500)                                                   | Yielded as an `ERROR` event with the appropriate `errorType` and `statusCode` |
| Network errors (DNS failure, connection refused)                                     | Caught and yielded as an `ERROR` event with `errorType: 'SYSTEM_ERROR'`       |
| Kubernetes API errors in the stream (e.g., `410 Gone` for expired resource versions) | Yielded as an `ERROR` event with the status information from the error object |
| Malformed JSON in the stream                                                         | Logged and skipped; the stream continues processing subsequent events         |
| Missing credentials                                                                  | Yielded as an `ERROR` event before any connection attempt                     |

This approach gives the caller full control over how to respond to each error condition without the risk of unhandled exceptions disrupting other operations.

### Stream Processing

The Kubernetes watch API delivers events as newline-delimited JSON (NDJSON) over a long-lived HTTP connection. Each line is a complete JSON object of the form:

```json
{"type": "ADDED", "object": {"apiVersion": "v1", "kind": "Pod", ...}}
```

Stream processing is integrated directly into the `watchResource` async generator, which:

1. Pipes the HTTP response body through the `split2` library for line-delimited parsing.
2. Skips empty lines.
3. Parses each line as JSON, logging and skipping malformed lines.
4. Transforms valid JSON into typed `KubernetesWatchEvent` objects.
5. Handles Kubernetes `ERROR` events by extracting status information.
6. Cleans up the stream in a `finally` block when the consumer stops iterating.

Keeping stream processing inline with the generator avoids an extra abstraction layer and keeps the full watch lifecycle — authentication, connection, streaming, cleanup — visible in a single method.

### Future: Informer Abstraction

The watch primitive proposed here is designed to serve as the foundation for a higher-level informer pattern in future work. An informer would combine:

- **Initial LIST**: Populate a local cache with the current state of resources.
- **Continuous WATCH**: Open a watch connection from the LIST's resource version to receive incremental updates.
- **Local Cache**: Maintain an in-memory store of all watched resources, updated in real-time.
- **Automatic Reconnection**: Handle `410 Gone` errors (expired resource versions) by re-listing and restarting the watch.
- **Periodic Resync**: Optionally re-list at intervals to guard against missed events.
- **Event Handlers**: Provide `on('add' | 'update' | 'delete', callback)` hooks for consumers.

This layered approach -- watch first, informer second -- follows the same architecture used by the official Kubernetes JavaScript client (`Watch` class -> `ListWatch` / `makeInformer`) and allows each layer to be independently tested and adopted.

The informer pattern would also take advantage of the `sendInitialEvents` and `resourceVersionMatch` watch options already included in Phase 1, which support the [KEP-3157 watch-list streaming](https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/3157-watch-list/README.md) enhancement. This replaces the initial LIST with a streaming watch, reaching Beta in Kubernetes 1.32 and demonstrating 100x memory efficiency improvement over standard LIST in testing.

## Release Plan

**Phase 1: Watch primitive (this BEP)**

- Add `KubernetesWatchEvent`, `KubernetesWatchEventType`, and `KubernetesWatchOptions` types to `@backstage/plugin-kubernetes-common`. Watch options include `sendInitialEvents` and `resourceVersionMatch` for KEP-3157 watch-list support.
- Add required `watchResource` method to the `KubernetesFetcher` interface in `@backstage/plugin-kubernetes-node`.
- Implement `watchResource` in `KubernetesClientBasedFetcher` in `@backstage/plugin-kubernetes-backend`.
- Comprehensive test coverage for all event types, error conditions, and watch options.
- Patch version bumps for all three packages (non-breaking, additive change).

**Phase 2: Informer abstraction (future BEP)**

- Build `KubernetesInformer` on top of `watchResource` with local caching, reconnection, and resync.
- Leverage the `sendInitialEvents` watch option (already available in Phase 1) to implement efficient initial state loading without a separate LIST call on clusters that support KEP-3157.
- Consider exposing informer state through the Backstage events system for cross-plugin consumption.

**Phase 3: Frontend integration (future BEP)**

- Evaluate approaches for surfacing real-time Kubernetes state in the frontend (Server-Sent Events, WebSocket proxying, or polling against a server-side cache).
- Update Kubernetes UI components to consume live state updates.

Each phase can be delivered independently. Phase 1 is fully backward compatible and requires no changes to existing consumers.

## Dependencies

- `split2` npm package (^4.2.0) for newline-delimited JSON stream parsing. This is a small, well-established library already used elsewhere in the Node.js ecosystem.
- Kubernetes API server support for the [watch API](https://kubernetes.io/docs/reference/using-api/api-concepts/#efficient-detection-of-changes), which has been a stable feature since Kubernetes 1.0.
- No dependency on other BEPs or in-progress Backstage features.

## Alternatives

### 1. Use the `@kubernetes/client-node` Watch and Informer classes directly

The official Kubernetes JavaScript client provides `Watch`, `Informer`, and `makeInformer` APIs that implement the full list+watch+cache pattern. However, the Backstage Kubernetes plugin deliberately moved away from the SDK's typed API clients in [PR #15250](https://github.com/backstage/backstage/pull/15250) (December 2022) due to three concerns: (1) the SDK's promise-rejection-on-non-2xx design made graceful multi-cluster error handling nearly impossible, (2) awkward positional parameter APIs, and (3) a dependency on the deprecated `request` library.

While concerns (2) and (3) have been addressed in the SDK's 1.x release, the error handling concern -- the primary motivation -- remains. The SDK still rejects promises on non-2xx responses, which is incompatible with the Backstage pattern of treating errors as structured data. Additionally, `@kubernetes/client-node` 1.x is ESM-only, which has caused [migration friction](https://github.com/backstage/backstage/issues/28325) in the Backstage ecosystem.

Building watch support on top of the existing custom fetch-based client is more consistent with the established architecture and avoids reintroducing the problems that motivated the original switch.

### 2. Expose watch connections through the existing proxy endpoint

The Kubernetes proxy endpoint (`/proxy`) already supports WebSocket upgrades, which could theoretically allow frontend clients to set up their own watch connections through Backstage. However, this approach pushes complexity to the frontend, does not enable server-side caching or aggregation, and does not address the multi-cluster fan-out problem. The proxy is designed for pass-through access to specific clusters, not for building efficient state synchronization patterns.

### 3. Implement polling with short intervals instead of watches

Polling at short intervals (e.g., every few seconds) would provide more timely data than the current on-demand model but does not solve the fundamental scalability problem. Every poll cycle still performs full LIST operations against every cluster, with the same memory and API server load concerns. It also misses events between poll intervals and scales poorly as the number of watched resource types increases. The Kubernetes ecosystem has comprehensively moved away from polling for these reasons.

### 4. Wait for `@kubernetes/client-node` to address the error handling concern

The SDK's error handling model (promise rejection on non-2xx) has been its design since inception and shows no signs of changing -- the 1.x rewrite improved the error type from `HttpError` to `ApiException` but kept the throw-on-error behavior. Waiting for a fundamental API redesign that may never come would indefinitely block a capability that would benefit Backstage users today.

### 5. Introduce a separate `KubernetesWatcher` interface instead of extending `KubernetesFetcher`

An alternative considered was defining a new `KubernetesWatcher` interface (with its own extension point) to keep the watch concern separate from the fetch concern. This was rejected because: (1) it would require duplicating the entire DI wiring in `plugin.ts` and `KubernetesInitializer.ts` — a new extension point class, factory type, and initialization logic — adding significant complexity for a single method, (2) the watch method reuses the same authentication, TLS, and URL construction code as the existing fetch methods, making `KubernetesClientBasedFetcher` the natural home, and (3) investigation found zero custom `KubernetesFetcher` implementations in the ecosystem, so the theoretical benefit of separating the interfaces (allowing independent implementation) has no practical value today.

### 6. Make `watchResource` optional on the `KubernetesFetcher` interface

Making the method optional (`watchResource?`) was considered to avoid breaking existing implementations. This was rejected after discovering that no custom `KubernetesFetcher` implementations exist outside the built-in `KubernetesClientBasedFetcher` — the `kubernetesFetcherExtensionPoint` has zero consumers across `backstage/backstage`, `backstage/community-plugins`, and known deployer repositories. A required method avoids the ergonomic cost of `if (fetcher.watchResource)` guards at every call site and signals that watch is a first-class capability of the fetcher, not an afterthought.
