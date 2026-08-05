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
  AuthorizeResult,
  PermissionCondition,
} from '@backstage/plugin-permission-common';
import { NotAllowedError, serializeError } from '@backstage/errors';
import { ANNOTATION_KUBERNETES_AUTH_PROVIDER } from '@backstage/plugin-kubernetes-common';
import express, { NextFunction, Request, Response } from 'express';
import Router from 'express-promise-router';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import request from 'supertest';

import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import {
  HEADER_KUBERNETES_CLUSTER,
  KubernetesProxy,
} from '../service/KubernetesProxy';
import {
  ClusterDetails,
  KubernetesClustersSupplier,
  AuthenticationStrategy,
} from '@backstage/plugin-kubernetes-node';
import { BackstageCredentials } from '@backstage/backend-plugin-api';
import { kubernetesProxyPermissionRules } from './rules';

function createLoggerMock() {
  const logger = {
    child: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
  logger.child.mockReturnValue(logger);
  return logger;
}

describe('Kubernetes Proxy ABAC enforcement', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

  let proxy: KubernetesProxy;
  let authStrategy: jest.Mocked<AuthenticationStrategy>;
  let permissionApi: {
    authorizeConditional: jest.Mock;
  };
  let auditor: ReturnType<typeof mockServices.auditor.mock>;
  let auditEvent: { success: jest.Mock; fail: jest.Mock };

  const clusterSupplier: jest.Mocked<KubernetesClustersSupplier> = {
    getClusters: jest.fn<
      Promise<ClusterDetails[]>,
      [{ credentials: BackstageCredentials }]
    >(),
  };

  const permissionsRegistry = {
    getPermissionRuleset: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();

    permissionsRegistry.getPermissionRuleset.mockReturnValue({
      getRuleByName: (name: string) => {
        return kubernetesProxyPermissionRules.find(r => r.name === name);
      },
    });

    auditor = mockServices.auditor.mock();
    auditEvent = {
      success: jest.fn().mockResolvedValue(undefined),
      fail: jest.fn().mockResolvedValue(undefined),
    };
    auditor.createEvent.mockResolvedValue(auditEvent);

    authStrategy = {
      getCredential: jest.fn().mockResolvedValue({
        type: 'bearer token',
        token: 'test-token',
      }),
      validateCluster: jest.fn(),
      presentAuthMetadata: jest.fn(),
    };

    proxy = new KubernetesProxy({
      logger: createLoggerMock(),
      clusterSupplier,
      authStrategy,
      discovery: {} as any,
      httpAuth: { credentials: jest.fn().mockResolvedValue({}) } as any,
      auditor,
    });

    permissionApi = {
      authorizeConditional: jest.fn(),
    };

    clusterSupplier.getClusters.mockResolvedValue([
      {
        name: 'production',
        url: 'https://k8s.example.com',
        authMetadata: {
          [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
        },
      },
    ] as ClusterDetails[]);

    worker.use(
      rest.get('https://k8s.example.com/*', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ kind: 'Pod', metadata: {} }));
      }),
      rest.delete('https://k8s.example.com/*', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ status: 'deleted' }));
      }),
      rest.post('https://k8s.example.com/*', (_req, res, ctx) => {
        return res(ctx.status(201), ctx.json({ kind: 'Pod', metadata: {} }));
      }),
    );
  });

  function buildApp() {
    const app = express().use(
      Router()
        .use(
          '/proxy',
          proxy.createRequestHandler({
            permissionApi: permissionApi as any,
            permissionsRegistry: permissionsRegistry as any,
          }),
        )
        .use(
          (err: Error, _req: Request, res: Response, _next: NextFunction) => {
            if (err instanceof NotAllowedError) {
              res.status(403).json({ error: serializeError(err) });
              return;
            }
            throw err;
          },
        ),
    );
    return app;
  }

  function sendProxyRequest(
    app: express.Application,
    method: 'get' | 'delete' | 'post',
    path: string,
    headers?: Record<string, string>,
  ) {
    const requestPromise = request(app)[method](path);
    if (headers) {
      for (const [headerName, headerValue] of Object.entries(headers)) {
        requestPromise.set(headerName, headerValue);
      }
    }
    worker.use(rest.all(requestPromise.url, (req: any) => req.passthrough()));
    return requestPromise;
  }

  function makeConditionalDecision(
    conditions:
      | PermissionCondition
      | { allOf: PermissionCondition[] }
      | { anyOf: PermissionCondition[] },
  ) {
    return {
      result: AuthorizeResult.CONDITIONAL,
      pluginId: 'kubernetes',
      resourceType: 'kubernetes-proxy-request',
      conditions,
    } as any;
  }

  it('allows read requests when policy grants read-only access', async () => {
    permissionApi.authorizeConditional.mockResolvedValue([
      makeConditionalDecision({
        rule: 'IS_ACTION',
        resourceType: 'kubernetes-proxy-request',
        params: { actions: ['read'] },
      }),
    ]);

    const app = buildApp();

    const response = await sendProxyRequest(
      app,
      'get',
      '/proxy/api/v1/namespaces/default/pods/my-pod',
      { [HEADER_KUBERNETES_CLUSTER]: 'production' },
    );

    expect(response.status).not.toBe(403);
  });

  it('allows single-cluster requests without cluster header when policy matches resolved cluster', async () => {
    permissionApi.authorizeConditional.mockResolvedValue([
      makeConditionalDecision({
        rule: 'IS_CLUSTER',
        resourceType: 'kubernetes-proxy-request',
        params: { clusters: ['production'] },
      }),
    ]);

    const app = buildApp();

    const response = await sendProxyRequest(
      app,
      'get',
      '/proxy/api/v1/namespaces/default/pods',
    );

    expect(response.status).not.toBe(403);
  });

  it('denies mutating requests when policy only grants read access', async () => {
    permissionApi.authorizeConditional.mockResolvedValue([
      makeConditionalDecision({
        rule: 'IS_ACTION',
        resourceType: 'kubernetes-proxy-request',
        params: { actions: ['read'] },
      }),
    ]);

    const app = buildApp();

    const response = await sendProxyRequest(
      app,
      'delete',
      '/proxy/api/v1/namespaces/default/pods/my-pod',
      { [HEADER_KUBERNETES_CLUSTER]: 'production' },
    );

    expect(response.status).toBe(403);
    expect(response.body.error.name).toBe('NotAllowedError');
  });

  it('denies exec requests when policy only grants read/write', async () => {
    permissionApi.authorizeConditional.mockResolvedValue([
      makeConditionalDecision({
        anyOf: [
          {
            rule: 'IS_ACTION',
            resourceType: 'kubernetes-proxy-request',
            params: { actions: ['read', 'write'] },
          },
        ],
      }),
    ]);

    const app = buildApp();

    const response = await sendProxyRequest(
      app,
      'post',
      '/proxy/api/v1/namespaces/default/pods/my-pod/exec',
      { [HEADER_KUBERNETES_CLUSTER]: 'production' },
    );

    expect(response.status).toBe(403);
  });

  it('allows access to specific cluster when policy restricts by cluster', async () => {
    permissionApi.authorizeConditional.mockResolvedValue([
      makeConditionalDecision({
        rule: 'IS_CLUSTER',
        resourceType: 'kubernetes-proxy-request',
        params: { clusters: ['production'] },
      }),
    ]);

    const app = buildApp();

    const response = await sendProxyRequest(
      app,
      'get',
      '/proxy/api/v1/namespaces/default/pods',
      { [HEADER_KUBERNETES_CLUSTER]: 'production' },
    );

    expect(response.status).not.toBe(403);
  });

  it('denies access to wrong cluster when policy restricts by cluster', async () => {
    permissionApi.authorizeConditional.mockResolvedValue([
      makeConditionalDecision({
        rule: 'IS_CLUSTER',
        resourceType: 'kubernetes-proxy-request',
        params: { clusters: ['staging'] },
      }),
    ]);

    const app = buildApp();

    const response = await sendProxyRequest(
      app,
      'get',
      '/proxy/api/v1/namespaces/default/pods',
      { [HEADER_KUBERNETES_CLUSTER]: 'production' },
    );

    expect(response.status).toBe(403);
  });

  it('denies secrets access when policy restricts resource type', async () => {
    permissionApi.authorizeConditional.mockResolvedValue([
      makeConditionalDecision({
        allOf: [
          {
            rule: 'IS_ACTION',
            resourceType: 'kubernetes-proxy-request',
            params: { actions: ['read'] },
          },
          {
            rule: 'IS_RESOURCE_TYPE',
            resourceType: 'kubernetes-proxy-request',
            params: { resourceTypes: ['pods', 'deployments'] },
          },
        ],
      }),
    ]);

    const app = buildApp();

    const response = await sendProxyRequest(
      app,
      'get',
      '/proxy/api/v1/namespaces/default/secrets/my-secret',
      { [HEADER_KUBERNETES_CLUSTER]: 'production' },
    );

    expect(response.status).toBe(403);
  });

  it('allows pod access when policy restricts resource type to pods', async () => {
    permissionApi.authorizeConditional.mockResolvedValue([
      makeConditionalDecision({
        allOf: [
          {
            rule: 'IS_ACTION',
            resourceType: 'kubernetes-proxy-request',
            params: { actions: ['read'] },
          },
          {
            rule: 'IS_RESOURCE_TYPE',
            resourceType: 'kubernetes-proxy-request',
            params: { resourceTypes: ['pods', 'deployments'] },
          },
        ],
      }),
    ]);

    const app = buildApp();

    const response = await sendProxyRequest(
      app,
      'get',
      '/proxy/api/v1/namespaces/default/pods/my-pod',
      { [HEADER_KUBERNETES_CLUSTER]: 'production' },
    );

    expect(response.status).not.toBe(403);
  });

  it('allows definitive ALLOW decisions without evaluating conditions', async () => {
    permissionApi.authorizeConditional.mockResolvedValue([
      { result: AuthorizeResult.ALLOW },
    ]);

    const app = buildApp();

    const response = await sendProxyRequest(
      app,
      'get',
      '/proxy/api/v1/namespaces/default/pods',
      { [HEADER_KUBERNETES_CLUSTER]: 'production' },
    );

    expect(response.status).not.toBe(403);
  });

  it('denies on definitive DENY decisions', async () => {
    permissionApi.authorizeConditional.mockResolvedValue([
      { result: AuthorizeResult.DENY },
    ]);

    const app = buildApp();

    const response = await sendProxyRequest(
      app,
      'get',
      '/proxy/api/v1/namespaces/default/pods',
      { [HEADER_KUBERNETES_CLUSTER]: 'production' },
    );

    expect(response.status).toBe(403);
  });

  it('denies namespace-restricted access to wrong namespace', async () => {
    permissionApi.authorizeConditional.mockResolvedValue([
      makeConditionalDecision({
        rule: 'IS_NAMESPACE',
        resourceType: 'kubernetes-proxy-request',
        params: { namespaces: ['allowed-ns'] },
      }),
    ]);

    const app = buildApp();

    const response = await sendProxyRequest(
      app,
      'get',
      '/proxy/api/v1/namespaces/default/pods',
      { [HEADER_KUBERNETES_CLUSTER]: 'production' },
    );

    expect(response.status).toBe(403);
  });

  it('does not leak cluster details on denied requests', async () => {
    permissionApi.authorizeConditional.mockResolvedValue([
      { result: AuthorizeResult.DENY },
    ]);

    const app = buildApp();

    const response = await sendProxyRequest(
      app,
      'get',
      '/proxy/api/v1/namespaces/default/secrets/admin-creds',
      { [HEADER_KUBERNETES_CLUSTER]: 'production' },
    );

    expect(response.status).toBe(403);
    expect(response.body.error.name).toBe('NotAllowedError');
    expect(response.body.error.message).toBe('Unauthorized');
    expect(JSON.stringify(response.body)).not.toContain('k8s.example.com');
    expect(JSON.stringify(response.body)).not.toContain('production');
  });
});
