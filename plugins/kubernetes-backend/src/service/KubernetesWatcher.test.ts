/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  KubernetesWatchEvent,
} from '@backstage/plugin-kubernetes-common';
import { KubernetesClientBasedWatcher } from './KubernetesWatcher';
import { KubernetesConnection } from './KubernetesConnection';
import { KubernetesCredential } from '@backstage/plugin-kubernetes-node';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';

describe('KubernetesWatcher', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

  const checkToken = (request: Request, token: string) => {
    switch (request.headers.get('Authorization')) {
      case `Bearer ${token}`:
        return undefined;
      default:
        return HttpResponse.json(
          {
            kind: 'Status',
            apiVersion: 'v1',
            code: 401,
          },
          { status: 401 },
        );
    }
  };

  describe('watchResource', () => {
    let sut: KubernetesClientBasedWatcher;
    const logger = mockServices.logger.mock();

    const defaultCluster = {
      name: 'test-cluster',
      url: 'http://localhost:9999',
      authMetadata: {},
    };
    const defaultCredential: KubernetesCredential = {
      type: 'bearer token' as const,
      token: 'token',
    };

    beforeEach(() => {
      sut = new KubernetesClientBasedWatcher({
        logger,
        connection: new KubernetesConnection({ logger }),
      });
    });

    it('should yield ADDED events for pod creation', async () => {
      const mockPod = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: {
          name: 'test-pod',
          namespace: 'default',
          resourceVersion: '12345',
        },
        spec: {
          containers: [{ name: 'nginx', image: 'nginx:latest' }],
        },
      };

      const watchData = JSON.stringify({
        type: 'ADDED',
        object: mockPod,
      });

      worker.use(
        http.get(
          'http://localhost:9999/api/v1/namespaces/default/pods',
          ({ request }) => {
            if (new URL(request.url).searchParams.get('watch') === 'true') {
              return (
                checkToken(request, 'token') ?? HttpResponse.text(watchData)
              );
            }
            return new HttpResponse(null, { status: 400 });
          },
        ),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource(
        {
          clusterDetails: defaultCluster,
          credential: defaultCredential,
          group: '',
          apiVersion: 'v1',
          plural: 'pods',
        },
        { namespace: 'default' },
      )) {
        events.push(event);
      }

      expect(events).toHaveLength(1);
      expect(events[0]).toEqual({
        type: 'ADDED',
        object: mockPod,
        resourceVersion: '12345',
      });
    });

    it('should yield ERROR event on network failure', async () => {
      worker.use(
        http.get('http://localhost:9999/*', () => {
          return HttpResponse.error();
        }),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource(
        {
          clusterDetails: defaultCluster,
          credential: defaultCredential,
          group: '',
          apiVersion: 'v1',
          plural: 'pods',
        },
        { namespace: 'default' },
      )) {
        events.push(event);
      }

      expect(events).toHaveLength(1);
      expect(events[0]).toEqual({
        type: 'ERROR',
        error: {
          errorType: 'SYSTEM_ERROR',
          statusCode: 0,
          resourcePath: '/api/v1/namespaces/default/pods',
        },
      });
    });

    it('should yield MODIFIED events for pod updates', async () => {
      const mockPod = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: {
          name: 'test-pod',
          namespace: 'default',
          resourceVersion: '12346',
        },
        spec: {
          containers: [{ name: 'nginx', image: 'nginx:1.21' }],
        },
      };

      const watchData = JSON.stringify({
        type: 'MODIFIED',
        object: mockPod,
      });

      worker.use(
        http.get(
          'http://localhost:9999/api/v1/namespaces/default/pods',
          ({ request }) => {
            if (new URL(request.url).searchParams.get('watch') === 'true') {
              return (
                checkToken(request, 'token') ?? HttpResponse.text(watchData)
              );
            }
            return new HttpResponse(null, { status: 400 });
          },
        ),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource(
        {
          clusterDetails: defaultCluster,
          credential: defaultCredential,
          group: '',
          apiVersion: 'v1',
          plural: 'pods',
        },
        { namespace: 'default' },
      )) {
        events.push(event);
      }

      expect(events).toHaveLength(1);
      expect(events[0]).toEqual({
        type: 'MODIFIED',
        object: mockPod,
        resourceVersion: '12346',
      });
    });

    it('should yield DELETED events for pod deletion', async () => {
      const mockPod = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: {
          name: 'test-pod',
          namespace: 'default',
          resourceVersion: '12347',
        },
      };

      const watchData = JSON.stringify({
        type: 'DELETED',
        object: mockPod,
      });

      worker.use(
        http.get(
          'http://localhost:9999/api/v1/namespaces/default/pods',
          ({ request }) => {
            if (new URL(request.url).searchParams.get('watch') === 'true') {
              return (
                checkToken(request, 'token') ?? HttpResponse.text(watchData)
              );
            }
            return new HttpResponse(null, { status: 400 });
          },
        ),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource(
        {
          clusterDetails: defaultCluster,
          credential: defaultCredential,
          group: '',
          apiVersion: 'v1',
          plural: 'pods',
        },
        { namespace: 'default' },
      )) {
        events.push(event);
      }

      expect(events).toHaveLength(1);
      expect(events[0]).toEqual({
        type: 'DELETED',
        object: mockPod,
        resourceVersion: '12347',
      });
    });

    it('should yield multiple events in sequence', async () => {
      const pod1 = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: { name: 'pod-1', namespace: 'default', resourceVersion: '1' },
      };
      const pod2 = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: { name: 'pod-2', namespace: 'default', resourceVersion: '2' },
      };

      const watchData = [
        JSON.stringify({ type: 'ADDED', object: pod1 }),
        JSON.stringify({ type: 'MODIFIED', object: pod2 }),
      ].join('\n');

      worker.use(
        http.get(
          'http://localhost:9999/api/v1/namespaces/default/pods',
          ({ request }) => {
            if (new URL(request.url).searchParams.get('watch') === 'true') {
              return (
                checkToken(request, 'token') ?? HttpResponse.text(watchData)
              );
            }
            return new HttpResponse(null, { status: 400 });
          },
        ),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource(
        {
          clusterDetails: defaultCluster,
          credential: defaultCredential,
          group: '',
          apiVersion: 'v1',
          plural: 'pods',
        },
        { namespace: 'default' },
      )) {
        events.push(event);
      }

      expect(events).toHaveLength(2);
      expect(events[0]).toEqual({
        type: 'ADDED',
        object: pod1,
        resourceVersion: '1',
      });
      expect(events[1]).toEqual({
        type: 'MODIFIED',
        object: pod2,
        resourceVersion: '2',
      });
    });

    it('should yield ERROR event for 401 Unauthorized', async () => {
      worker.use(
        http.get('http://localhost:9999/*', () => {
          return HttpResponse.text('authentication required', { status: 401 });
        }),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource(
        {
          clusterDetails: defaultCluster,
          credential: { type: 'bearer token', token: 'bad-token' },
          group: '',
          apiVersion: 'v1',
          plural: 'pods',
        },
        { namespace: 'default' },
      )) {
        events.push(event);
      }

      expect(events).toHaveLength(1);
      expect(events[0]).toEqual({
        type: 'ERROR',
        error: {
          errorType: 'UNAUTHORIZED_ERROR',
          statusCode: 401,
          resourcePath: '/api/v1/namespaces/default/pods',
        },
      });
    });

    it('should yield ERROR event for 404 Not Found', async () => {
      worker.use(
        http.get('http://localhost:9999/*', () => {
          return HttpResponse.text('resource not found', { status: 404 });
        }),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource({
        clusterDetails: defaultCluster,
        credential: defaultCredential,
        group: '',
        apiVersion: 'v1',
        plural: 'invalidresource',
      })) {
        events.push(event);
      }

      expect(events).toHaveLength(1);
      expect(events[0]).toEqual({
        type: 'ERROR',
        error: {
          errorType: 'NOT_FOUND',
          statusCode: 404,
          resourcePath: '/api/v1/invalidresource',
        },
      });
    });

    it('should yield ERROR event for 500 Server Error', async () => {
      worker.use(
        http.get('http://localhost:9999/*', () => {
          return HttpResponse.text('internal server error', { status: 500 });
        }),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource({
        clusterDetails: defaultCluster,
        credential: defaultCredential,
        group: '',
        apiVersion: 'v1',
        plural: 'pods',
      })) {
        events.push(event);
      }

      expect(events).toHaveLength(1);
      expect(events[0]).toEqual({
        type: 'ERROR',
        error: {
          errorType: 'SYSTEM_ERROR',
          statusCode: 500,
          resourcePath: '/api/v1/pods',
        },
      });
    });

    it('should yield ERROR event for K8s ERROR event in stream', async () => {
      const errorEvent = JSON.stringify({
        type: 'ERROR',
        object: {
          kind: 'Status',
          apiVersion: 'v1',
          metadata: {},
          status: 'Failure',
          message: 'too old resource version: 1 (8)',
          reason: 'Expired',
          code: 410,
        },
      });

      worker.use(
        http.get('http://localhost:9999/*', ({ request }) => {
          if (new URL(request.url).searchParams.get('watch') === 'true') {
            return HttpResponse.text(errorEvent);
          }
          return new HttpResponse(null, { status: 400 });
        }),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource(
        {
          clusterDetails: defaultCluster,
          credential: defaultCredential,
          group: '',
          apiVersion: 'v1',
          plural: 'pods',
        },
        { resourceVersion: '1' },
      )) {
        events.push(event);
      }

      expect(events).toHaveLength(1);
      expect(events[0]).toEqual({
        type: 'ERROR',
        error: {
          statusCode: 410,
          errorType: 'UNKNOWN_ERROR',
          resourcePath: '/api/v1/pods',
        },
      });
    });

    it('should handle mix of normal events and ERROR events', async () => {
      const pod = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: { name: 'test-pod', resourceVersion: '100' },
      };

      const watchData = [
        JSON.stringify({ type: 'ADDED', object: pod }),
        JSON.stringify({
          type: 'ERROR',
          object: { kind: 'Status', code: 410, reason: 'Expired' },
        }),
      ].join('\n');

      worker.use(
        http.get('http://localhost:9999/*', ({ request }) => {
          if (new URL(request.url).searchParams.get('watch') === 'true') {
            return HttpResponse.text(watchData);
          }
          return new HttpResponse(null, { status: 400 });
        }),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource({
        clusterDetails: defaultCluster,
        credential: defaultCredential,
        group: '',
        apiVersion: 'v1',
        plural: 'pods',
      })) {
        events.push(event);
      }

      expect(events).toHaveLength(2);
      expect(events[0].type).toBe('ADDED');
      expect(events[1].type).toBe('ERROR');
    });

    it('should skip malformed JSON and continue watching', async () => {
      const pod = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: { name: 'test-pod', resourceVersion: '100' },
      };

      const watchData = [
        JSON.stringify({ type: 'ADDED', object: pod }),
        '{ invalid json',
        JSON.stringify({ type: 'MODIFIED', object: pod }),
      ].join('\n');

      worker.use(
        http.get('http://localhost:9999/*', ({ request }) => {
          if (new URL(request.url).searchParams.get('watch') === 'true') {
            return HttpResponse.text(watchData);
          }
          return new HttpResponse(null, { status: 400 });
        }),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource({
        clusterDetails: defaultCluster,
        credential: defaultCredential,
        group: '',
        apiVersion: 'v1',
        plural: 'pods',
      })) {
        events.push(event);
      }

      expect(events).toHaveLength(2);
      expect(events[0].type).toBe('ADDED');
      expect(events[1].type).toBe('MODIFIED');
    });

    it('should skip empty lines', async () => {
      const pod = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: { name: 'test-pod', resourceVersion: '100' },
      };

      const watchData = [
        JSON.stringify({ type: 'ADDED', object: pod }),
        '',
        '',
        JSON.stringify({ type: 'MODIFIED', object: pod }),
      ].join('\n');

      worker.use(
        http.get('http://localhost:9999/*', ({ request }) => {
          if (new URL(request.url).searchParams.get('watch') === 'true') {
            return HttpResponse.text(watchData);
          }
          return new HttpResponse(null, { status: 400 });
        }),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource({
        clusterDetails: defaultCluster,
        credential: defaultCredential,
        group: '',
        apiVersion: 'v1',
        plural: 'pods',
      })) {
        events.push(event);
      }

      expect(events).toHaveLength(2);
      expect(events[0].type).toBe('ADDED');
      expect(events[1].type).toBe('MODIFIED');
    });

    it('should respect namespace, labelSelector, and resourceVersion options', async () => {
      const pod = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: {
          name: 'test-pod',
          namespace: 'my-namespace',
          resourceVersion: '12345',
          labels: { app: 'frontend' },
        },
      };

      const watchData = JSON.stringify({ type: 'ADDED', object: pod });

      let requestedUrl = '';
      let labelSelectorParam = '';
      let resourceVersionParam = '';
      worker.use(
        http.get('http://localhost:9999/*', ({ request }) => {
          const url = new URL(request.url);
          requestedUrl = url.pathname;
          labelSelectorParam = url.searchParams.get('labelSelector') || '';
          resourceVersionParam = url.searchParams.get('resourceVersion') || '';
          if (url.searchParams.get('watch') === 'true') {
            return HttpResponse.text(watchData);
          }
          return new HttpResponse(null, { status: 400 });
        }),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource(
        {
          clusterDetails: defaultCluster,
          credential: defaultCredential,
          group: '',
          apiVersion: 'v1',
          plural: 'pods',
        },
        {
          namespace: 'my-namespace',
          labelSelector: 'app=frontend',
          resourceVersion: '12345',
        },
      )) {
        events.push(event);
      }

      expect(events).toHaveLength(1);
      expect(requestedUrl).toBe('/api/v1/namespaces/my-namespace/pods');
      expect(labelSelectorParam).toBe('app=frontend');
      expect(resourceVersionParam).toBe('12345');
    });

    it('should respect timeoutSeconds, allowWatchBookmarks, sendInitialEvents, and resourceVersionMatch options', async () => {
      const pod = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: { name: 'test-pod', resourceVersion: '100' },
      };

      const watchData = JSON.stringify({ type: 'ADDED', object: pod });

      let timeoutSecondsParam = '';
      let allowWatchBookmarksParam = '';
      let sendInitialEventsParam = '';
      let resourceVersionMatchParam = '';
      worker.use(
        http.get('http://localhost:9999/*', ({ request }) => {
          const url = new URL(request.url);
          timeoutSecondsParam = url.searchParams.get('timeoutSeconds') || '';
          allowWatchBookmarksParam =
            url.searchParams.get('allowWatchBookmarks') || '';
          sendInitialEventsParam =
            url.searchParams.get('sendInitialEvents') || '';
          resourceVersionMatchParam =
            url.searchParams.get('resourceVersionMatch') || '';
          if (url.searchParams.get('watch') === 'true') {
            return HttpResponse.text(watchData);
          }
          return new HttpResponse(null, { status: 400 });
        }),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource(
        {
          clusterDetails: defaultCluster,
          credential: defaultCredential,
          group: '',
          apiVersion: 'v1',
          plural: 'pods',
        },
        {
          timeoutSeconds: 300,
          allowWatchBookmarks: true,
          sendInitialEvents: true,
          resourceVersionMatch: 'NotOlderThan',
        },
      )) {
        events.push(event);
      }

      expect(events).toHaveLength(1);
      expect(timeoutSecondsParam).toBe('300');
      expect(allowWatchBookmarksParam).toBe('true');
      expect(sendInitialEventsParam).toBe('true');
      expect(resourceVersionMatchParam).toBe('NotOlderThan');
    });

    it('should watch custom resources', async () => {
      const customResource = {
        apiVersion: 'example.com/v1',
        kind: 'CustomThing',
        metadata: { name: 'test-thing', resourceVersion: '100' },
        spec: { foo: 'bar' },
      };

      const watchData = JSON.stringify({
        type: 'ADDED',
        object: customResource,
      });

      let requestedUrl = '';
      worker.use(
        http.get('http://localhost:9999/*', ({ request }) => {
          const url = new URL(request.url);
          requestedUrl = url.pathname;
          if (url.searchParams.get('watch') === 'true') {
            return HttpResponse.text(watchData);
          }
          return new HttpResponse(null, { status: 400 });
        }),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource({
        clusterDetails: defaultCluster,
        credential: defaultCredential,
        group: 'example.com',
        apiVersion: 'v1',
        plural: 'customthings',
      })) {
        events.push(event);
      }

      expect(events).toHaveLength(1);
      expect(requestedUrl).toBe('/apis/example.com/v1/customthings');
    });

    it('should authenticate with bearer token', async () => {
      const pod = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: { name: 'test-pod', resourceVersion: '100' },
      };

      const watchData = JSON.stringify({ type: 'ADDED', object: pod });

      let authHeader = '';
      worker.use(
        http.get('http://localhost:9999/*', ({ request }) => {
          authHeader = request.headers.get('Authorization') || '';
          if (new URL(request.url).searchParams.get('watch') === 'true') {
            return HttpResponse.text(watchData);
          }
          return new HttpResponse(null, { status: 400 });
        }),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource({
        clusterDetails: defaultCluster,
        credential: { type: 'bearer token', token: 'my-secret-token' },
        group: '',
        apiVersion: 'v1',
        plural: 'pods',
      })) {
        events.push(event);
      }

      expect(events).toHaveLength(1);
      expect(authHeader).toBe('Bearer my-secret-token');
    });

    it('should use x509 client certificate authentication', async () => {
      const pod = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: { name: 'test-pod', resourceVersion: '100' },
      };

      const watchData = JSON.stringify({ type: 'ADDED', object: pod });

      worker.use(
        http.get('http://localhost:9999/*', ({ request }) => {
          if (new URL(request.url).searchParams.get('watch') === 'true') {
            return HttpResponse.text(watchData);
          }
          return new HttpResponse(null, { status: 400 });
        }),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource({
        clusterDetails: defaultCluster,
        credential: {
          type: 'x509 client certificate',
          cert: 'MOCKCERT',
          key: 'MOCKKEY',
        },
        group: '',
        apiVersion: 'v1',
        plural: 'pods',
      })) {
        events.push(event);
      }

      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('ADDED');
    });

    it('should yield ERROR event when credentials are missing', async () => {
      worker.use(
        http.get('http://localhost:9999/*', () => {
          return HttpResponse.text('Unauthorized', { status: 401 });
        }),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource({
        clusterDetails: defaultCluster,
        credential: { type: 'anonymous' },
        group: '',
        apiVersion: 'v1',
        plural: 'pods',
      })) {
        events.push(event);
      }

      expect(events).toHaveLength(1);
      expect(events[0]).toEqual({
        type: 'ERROR',
        error: {
          errorType: 'UNAUTHORIZED_ERROR',
          statusCode: 401,
          resourcePath: '/api/v1/pods',
        },
      });
    });

    it('should yield BOOKMARK events for efficient resource version tracking', async () => {
      const pod = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: { name: 'test-pod', resourceVersion: '100' },
      };

      const bookmark = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: { resourceVersion: '12345' },
      };

      const watchData = [
        JSON.stringify({ type: 'ADDED', object: pod }),
        JSON.stringify({ type: 'BOOKMARK', object: bookmark }),
      ].join('\n');

      worker.use(
        http.get('http://localhost:9999/*', ({ request }) => {
          if (new URL(request.url).searchParams.get('watch') === 'true') {
            return HttpResponse.text(watchData);
          }
          return new HttpResponse(null, { status: 400 });
        }),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource(
        {
          clusterDetails: defaultCluster,
          credential: defaultCredential,
          group: '',
          apiVersion: 'v1',
          plural: 'pods',
        },
        { allowWatchBookmarks: true },
      )) {
        events.push(event);
      }

      expect(events).toHaveLength(2);
      expect(events[0]).toEqual({
        type: 'ADDED',
        object: pod,
        resourceVersion: '100',
      });
      expect(events[1]).toEqual({
        type: 'BOOKMARK',
        object: bookmark,
        resourceVersion: '12345',
      });
    });

    it('should stop yielding events when signal is aborted', async () => {
      const pod = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: { name: 'test-pod', resourceVersion: '100' },
      };

      const watchData = [
        JSON.stringify({ type: 'ADDED', object: pod }),
        JSON.stringify({ type: 'MODIFIED', object: pod }),
        JSON.stringify({ type: 'DELETED', object: pod }),
      ].join('\n');

      worker.use(
        http.get('http://localhost:9999/*', ({ request }) => {
          if (new URL(request.url).searchParams.get('watch') === 'true') {
            return HttpResponse.text(watchData);
          }
          return new HttpResponse(null, { status: 400 });
        }),
      );

      const controller = new AbortController();
      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource(
        {
          clusterDetails: defaultCluster,
          credential: defaultCredential,
          group: '',
          apiVersion: 'v1',
          plural: 'pods',
        },
        { signal: controller.signal },
      )) {
        events.push(event);
        if (events.length === 1) {
          controller.abort();
        }
      }

      expect(events.length).toBeLessThanOrEqual(2);
      expect(events[0].type).toBe('ADDED');
    });

    it('should not yield any events when signal is already aborted', async () => {
      const controller = new AbortController();
      controller.abort();

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource(
        {
          clusterDetails: defaultCluster,
          credential: defaultCredential,
          group: '',
          apiVersion: 'v1',
          plural: 'pods',
        },
        { signal: controller.signal },
      )) {
        events.push(event);
      }

      expect(events).toHaveLength(0);
    });

    it.each(['google', 'oidc', 'aks'])(
      'should reject client-side auth provider "%s"',
      async provider => {
        const events: KubernetesWatchEvent[] = [];
        for await (const event of sut.watchResource({
          clusterDetails: {
            name: 'test-cluster',
            url: 'http://localhost:9999',
            authMetadata: {
              [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: provider,
            },
          },
          credential: { type: 'bearer token', token: 'some-token' },
          group: '',
          apiVersion: 'v1',
          plural: 'pods',
        })) {
          events.push(event);
        }

        expect(events).toHaveLength(1);
        expect(events[0]).toEqual({
          type: 'ERROR',
          error: {
            errorType: 'BAD_REQUEST',
            statusCode: 400,
            resourcePath: '/api/v1/pods',
          },
        });
      },
    );

    it.each([
      'serviceAccount',
      'googleServiceAccount',
      'aws',
      'azure',
      'localKubectlProxy',
    ])('should allow server-side auth provider "%s"', async provider => {
      const pod = {
        apiVersion: 'v1',
        kind: 'Pod',
        metadata: { name: 'test-pod', resourceVersion: '100' },
      };

      worker.use(
        http.get('http://localhost:9999/*', ({ request }) => {
          if (new URL(request.url).searchParams.get('watch') === 'true') {
            return HttpResponse.text(
              JSON.stringify({ type: 'ADDED', object: pod }),
            );
          }
          return new HttpResponse(null, { status: 400 });
        }),
      );

      const events: KubernetesWatchEvent[] = [];
      for await (const event of sut.watchResource({
        clusterDetails: {
          name: 'test-cluster',
          url: 'http://localhost:9999',
          authMetadata: {
            [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: provider,
          },
        },
        credential: { type: 'bearer token', token: 'some-token' },
        group: '',
        apiVersion: 'v1',
        plural: 'pods',
      })) {
        events.push(event);
      }

      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('ADDED');
    });
  });
});
