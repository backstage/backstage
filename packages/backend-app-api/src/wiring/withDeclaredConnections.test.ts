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
import { DefaultConnectionsService } from '@backstage/connections-node';
import { withDeclaredConnections } from './withDeclaredConnections';
import { JsonArray } from '@backstage/types';

const mockConnectionsConfig = (connections: JsonArray) =>
  mockServices.rootConfig({ data: { connections } });

const githubConnection = {
  type: 'github' as const,
  host: 'github.com',
  auth: [{ method: 'token' as const, token: 'test-token' }],
};

const gitlabConnection = {
  type: 'gitlab' as const,
  host: 'gitlab.com',
  auth: [{ method: 'token' as const, token: 'gl-token' }],
};

describe('withDeclaredConnections', () => {
  it('allows find for a declared connection type', async () => {
    const root = DefaultConnectionsService.create({
      logger: mockServices.logger.mock(),
      config: mockConnectionsConfig([githubConnection]),
    });
    const pluginService = root.forPlugin('catalog');
    const wrapped = withDeclaredConnections(pluginService, [
      { type: 'github' },
    ]);

    const connection = await wrapped.find({
      type: 'github',
      url: 'https://github.com/my-org/my-repo',
      authMethods: ['token'],
    });

    expect(connection.host).toBe('github.com');
    expect(connection.auth.method).toBe('token');
  });

  it('throws when find is called with an undeclared connection type', async () => {
    const root = DefaultConnectionsService.create({
      logger: mockServices.logger.mock(),
      config: mockConnectionsConfig([githubConnection, gitlabConnection]),
    });
    const pluginService = root.forPlugin('catalog');
    const wrapped = withDeclaredConnections(pluginService, [
      { type: 'github' },
    ]);

    await expect(
      wrapped.find({
        type: 'gitlab',
        url: 'https://gitlab.com/my-org/my-repo',
        authMethods: ['token'],
      }),
    ).rejects.toThrow(
      /undeclared connection of type "gitlab".*declareConnection/,
    );
  });

  it('enforces per-module narrowing over plugin-aggregated registrations', async () => {
    const root = DefaultConnectionsService.create({
      logger: mockServices.logger.mock(),
      config: mockConnectionsConfig([githubConnection, gitlabConnection]),
    });
    const pluginService = root.forPlugin('catalog');

    const moduleA = withDeclaredConnections(pluginService, [
      { type: 'github' },
    ]);
    const moduleB = withDeclaredConnections(pluginService, [
      { type: 'gitlab' },
    ]);

    await expect(
      moduleA.find({
        type: 'github',
        url: 'https://github.com/my-org/my-repo',
        authMethods: ['token'],
      }),
    ).resolves.toMatchObject({ host: 'github.com' });

    await expect(
      moduleA.find({
        type: 'gitlab',
        url: 'https://gitlab.com/my-org/my-repo',
        authMethods: ['token'],
      }),
    ).rejects.toThrow(/undeclared connection of type "gitlab"/);

    await expect(
      moduleB.find({
        type: 'gitlab',
        url: 'https://gitlab.com/my-org/my-repo',
        authMethods: ['token'],
      }),
    ).resolves.toMatchObject({ host: 'gitlab.com' });

    await expect(
      moduleB.find({
        type: 'github',
        url: 'https://github.com/my-org/my-repo',
        authMethods: ['token'],
      }),
    ).rejects.toThrow(/undeclared connection of type "github"/);
  });
});
