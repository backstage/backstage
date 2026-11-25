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
import { mockServices } from '@backstage/backend-test-utils';
import type { Connection, ConnectionsService } from '@backstage/connections';
import { ResponseError } from '@backstage/errors';
import { DefaultConnectionsService } from './DefaultConnectionsService';

// These standalone requests mirror the provider guides and run against mocked HTTP.
async function readSentryProjects(
  connections: ConnectionsService,
  instanceUrl: string,
  organization: string,
) {
  const connection = await connections.find({
    type: 'sentry',
    query: { url: instanceUrl },
    authMethods: ['token'],
  });
  const apiRoot =
    connection.apiBaseUrl ?? new URL('api/0/', connection.baseUrl);
  const url = new URL(
    `organizations/${encodeURIComponent(organization)}/projects/`,
    apiRoot,
  );
  const response = await fetch(url, {
    redirect: 'error',
    headers: { Authorization: `Bearer ${connection.auth.token}` },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}

async function readBuildkiteBuilds(
  connections: ConnectionsService,
  instanceUrl: string,
  organization: string,
  pipeline: string,
) {
  const connection = await connections.find({
    type: 'buildkite',
    query: { url: instanceUrl },
    authMethods: ['token'],
  });
  const apiRoot = connection.apiBaseUrl ?? new URL('v2/', connection.baseUrl);
  const url = new URL(
    `organizations/${encodeURIComponent(
      organization,
    )}/pipelines/${encodeURIComponent(pipeline)}/builds`,
    apiRoot,
  );
  const response = await fetch(url, {
    redirect: 'error',
    headers: { Authorization: `Bearer ${connection.auth.token}` },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}

async function readCircleCiPipelines(
  connections: ConnectionsService,
  instanceUrl: string,
  organization: string,
  project: string,
) {
  const connection = await connections.find({
    type: 'circleci',
    query: { url: instanceUrl },
    authMethods: ['token'],
  });
  const apiRoot = connection.apiBaseUrl ?? new URL('api/', connection.baseUrl);
  const url = new URL(
    `v2/project/gh/${encodeURIComponent(organization)}/${encodeURIComponent(
      project,
    )}/pipeline`,
    apiRoot,
  );
  const response = await fetch(url, {
    redirect: 'error',
    headers: { 'Circle-Token': connection.auth.token },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}

async function readLaunchDarklyFlags(
  connections: ConnectionsService,
  instanceUrl: string,
  project: string,
) {
  const connection = await connections.find({
    type: 'launchdarkly',
    query: { url: instanceUrl },
    authMethods: ['token'],
  });
  const apiRoot =
    connection.apiBaseUrl ?? new URL('api/v2/', connection.baseUrl);
  const url = new URL(`flags/${encodeURIComponent(project)}`, apiRoot);
  const response = await fetch(url, {
    redirect: 'error',
    headers: { Authorization: connection.auth.token },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}

async function readOctopusProjects(
  connections: ConnectionsService,
  instanceUrl: string,
  spaceId: string,
) {
  const connection = await connections.find({
    type: 'octopus-deploy',
    query: { url: instanceUrl },
    authMethods: ['apiKey'],
  });
  const apiRoot = connection.apiBaseUrl ?? new URL('api/', connection.baseUrl);
  const url = new URL(`${encodeURIComponent(spaceId)}/projects`, apiRoot);
  const response = await fetch(url, {
    redirect: 'error',
    headers: { 'X-Octopus-ApiKey': connection.auth.apiKey },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}

async function readDynatraceProblems(
  connections: ConnectionsService,
  instanceUrl: string,
) {
  const connection = await connections.find({
    type: 'dynatrace',
    query: { url: instanceUrl },
    authMethods: ['token'],
  });
  const apiRoot =
    connection.apiBaseUrl ?? new URL('api/v2/', connection.baseUrl);
  const url = new URL('problems', apiRoot);
  const response = await fetch(url, {
    redirect: 'error',
    headers: { Authorization: `Api-Token ${connection.auth.token}` },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}

async function readFossaOrganizations(
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

async function readRollbarProjects(
  connections: ConnectionsService,
  instanceUrl: string,
) {
  const connection = await connections.find({
    type: 'rollbar',
    query: { url: instanceUrl },
    authMethods: ['token'],
  });
  const apiRoot =
    connection.apiBaseUrl ?? new URL('api/1/', connection.baseUrl);
  const url = new URL('projects', apiRoot);
  const response = await fetch(url, {
    redirect: 'error',
    headers: { 'X-Rollbar-Access-Token': connection.auth.token },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }
  return response.json();
}

const providers = [
  {
    type: 'sentry',
    method: 'token',
    field: 'token',
    read: (service: ConnectionsService, url: string) =>
      readSentryProjects(service, url, 'acme'),
    sampleBaseUrl: 'https://sentry.io/',
    path: 'api/0/organizations/acme/projects/',
    header: 'Authorization',
    prefix: 'Bearer ',
  },
  {
    type: 'buildkite',
    method: 'token',
    field: 'token',
    read: (service: ConnectionsService, url: string) =>
      readBuildkiteBuilds(service, url, 'acme', 'service'),
    sampleBaseUrl: 'https://api.buildkite.com/',
    path: 'v2/organizations/acme/pipelines/service/builds',
    header: 'Authorization',
    prefix: 'Bearer ',
  },
  {
    type: 'circleci',
    method: 'token',
    field: 'token',
    read: (service: ConnectionsService, url: string) =>
      readCircleCiPipelines(service, url, 'acme', 'service'),
    sampleBaseUrl: 'https://circleci.com/',
    path: 'api/v2/project/gh/acme/service/pipeline',
    header: 'Circle-Token',
    prefix: '',
  },
  {
    type: 'launchdarkly',
    method: 'token',
    field: 'token',
    read: (service: ConnectionsService, url: string) =>
      readLaunchDarklyFlags(service, url, 'service'),
    sampleBaseUrl: 'https://app.launchdarkly.com/',
    path: 'api/v2/flags/service',
    header: 'Authorization',
    prefix: '',
  },
  {
    type: 'octopus-deploy',
    method: 'apiKey',
    field: 'apiKey',
    read: (service: ConnectionsService, url: string) =>
      readOctopusProjects(service, url, 'Spaces-1'),
    sampleBaseUrl: 'https://deploy.example.com/octopus/',
    path: 'api/Spaces-1/projects',
    header: 'X-Octopus-ApiKey',
    prefix: '',
  },
  {
    type: 'dynatrace',
    method: 'token',
    field: 'token',
    read: (service: ConnectionsService, url: string) =>
      readDynatraceProblems(service, url),
    sampleBaseUrl: 'https://abc12345.live.dynatrace.com/',
    path: 'api/v2/problems',
    header: 'Authorization',
    prefix: 'Api-Token ',
  },
  {
    type: 'fossa',
    method: 'token',
    field: 'token',
    read: (service: ConnectionsService, url: string) =>
      readFossaOrganizations(service, url),
    sampleBaseUrl: 'https://app.fossa.com/',
    path: 'api/organizations',
    header: 'Authorization',
    prefix: 'Bearer ',
  },
  {
    type: 'rollbar',
    method: 'token',
    field: 'token',
    read: (service: ConnectionsService, url: string) =>
      readRollbarProjects(service, url),
    sampleBaseUrl: 'https://api.rollbar.com/',
    path: 'api/1/projects',
    header: 'X-Rollbar-Access-Token',
    prefix: '',
  },
] as const;

describe.each(providers)(
  '$type service and guide',
  ({ type, method, field, read, sampleBaseUrl, path, header, prefix }) => {
    const baseUrl = 'https://example.com:8443/context%2Fname%3F%23';
    const create = (apiBaseUrl?: string, slash = '') =>
      DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockServices.rootConfig({
          data: {
            connections: [
              {
                type,
                baseUrl: `${baseUrl}${slash}`,
                apiBaseUrl,
                auth: [
                  { method, [field]: 'dummy-default' },
                  {
                    method,
                    [field]: 'dummy-scoped',
                    match: { plugins: ['reader'] },
                  },
                  { method, [field]: 'dummy-later' },
                ],
              },
            ],
          },
        }),
      });

    it('uses host identity and plugin credentials without returning host metadata', async () => {
      const service = create('http://internal:8080/proxy/api');
      const find = (plugin: string, url = `${baseUrl}/${path}`) =>
        service
          .forPlugin(plugin)
          .find({ type, query: { url }, authMethods: [method] });
      const connection = await find('reader');
      expect(connection.auth).toMatchObject({ [field]: 'dummy-scoped' });
      expect((await find('other')).auth).toMatchObject({
        [field]: 'dummy-default',
      });
      expect(
        await find('reader', 'https://example.com:8443/organizations/other'),
      ).toEqual(connection);
      expect(connection.apiBaseUrl).toBe('http://internal:8080/proxy/api/');
      expect(connection).not.toHaveProperty('host');
      // @ts-expect-error - lookup identity is not returned connection data
      expect(connection.host).toBeUndefined();
      for (const url of [
        'https://example.com',
        'http://internal:8080/proxy/api',
      ]) {
        await expect(find('reader', url)).rejects.toThrow(
          /Connection not found/,
        );
      }
      const info = await service
        .forPlugin('reader')
        .find({ type, query: { url: baseUrl } });
      expect(info).not.toHaveProperty('auth');
    });

    it('executes the guide request with normalized roots, overrides and response errors', async () => {
      const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ items: [] }),
      } as Response);
      try {
        const sampleService = DefaultConnectionsService.create({
          logger: mockServices.logger.mock(),
          config: mockServices.rootConfig({
            data: {
              connections: [
                {
                  type,
                  baseUrl: sampleBaseUrl,
                  auth: [{ method, [field]: 'dummy-sample' }],
                },
              ],
            },
          }),
        }).forPlugin('reader');
        await expect(
          read(sampleService, `${sampleBaseUrl}${path}`),
        ).resolves.toEqual({ items: [] });
        expect(String(fetchMock.mock.calls[0][0])).toBe(
          `${sampleBaseUrl}${path}`,
        );
        expect(fetchMock.mock.calls[0][1]).toEqual({
          redirect: 'error',
          headers: { [header]: `${prefix}dummy-sample` },
        });
        for (const slash of ['', '/']) {
          for (const override of [false, true]) {
            const apiBaseUrl = override
              ? `http://127.0.0.1:8080/proxy%2Fcontext/api${slash}`
              : undefined;
            const service = create(apiBaseUrl, slash).forPlugin('reader');
            const connection = await service.find({
              type,
              query: { url: baseUrl },
              authMethods: [method],
            });
            expect(connection.apiBaseUrl).toBe(
              override
                ? 'http://127.0.0.1:8080/proxy%2Fcontext/api/'
                : undefined,
            );
            await expect(read(service, baseUrl)).resolves.toEqual({
              items: [],
            });
            const [url, options] =
              fetchMock.mock.calls[fetchMock.mock.calls.length - 1];
            // The override includes the provider's full prefix, so only the
            // endpoint portion from the guide is appended below.
            const endpoint = {
              sentry: 'organizations/acme/projects/',
              buildkite: 'organizations/acme/pipelines/service/builds',
              circleci: 'v2/project/gh/acme/service/pipeline',
              launchdarkly: 'flags/service',
              'octopus-deploy': 'Spaces-1/projects',
              dynatrace: 'problems',
              fossa: 'organizations',
              rollbar: 'projects',
            }[type];
            expect(String(url)).toBe(
              override
                ? `http://127.0.0.1:8080/proxy%2Fcontext/api/${endpoint}`
                : `${baseUrl}/${path}`,
            );
            expect(options).toEqual({
              redirect: 'error',
              headers: { [header]: `${prefix}dummy-scoped` },
            });
          }
        }
        fetchMock.mockResolvedValue(
          new Response(JSON.stringify({ message: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
        await expect(
          read(create().forPlugin('reader'), baseUrl),
        ).rejects.toBeInstanceOf(ResponseError);
      } finally {
        fetchMock.mockRestore();
      }
    });
  },
);

// Verify all eight registry entries infer concrete public connection/auth data.
function assertPublicTypes(
  connection: Connection<
    | 'sentry'
    | 'buildkite'
    | 'circleci'
    | 'launchdarkly'
    | 'octopus-deploy'
    | 'dynatrace'
    | 'fossa'
    | 'rollbar'
  >,
) {
  const root: string = connection.baseUrl;
  const override: string | undefined = connection.apiBaseUrl;
  if (connection.auth.method === 'apiKey') {
    const key: string = connection.auth.apiKey;
    return { root, override, key };
  }
  const token: string = connection.auth.token;
  // @ts-expect-error - no token auth method exposes an API key
  void connection.auth.apiKey;
  return { root, override, token };
}
void assertPublicTypes;
