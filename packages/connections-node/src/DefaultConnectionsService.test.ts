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
import { DefaultConnectionsService } from './DefaultConnectionsService';
import { JsonArray } from '@backstage/types';

const mockConnectionsConfig = (connections: JsonArray) =>
  mockServices.rootConfig({ data: { connections } });

describe('DefaultConnectionsService', () => {
  describe('forPlugin', () => {
    it('exposes unrestricted connections to every plugin', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'github.com',
            auth: [{ method: 'token', token: 'public-token' }],
          },
        ]),
      });

      const connection = await service.forPlugin('catalog').find({
        type: 'github',
        url: 'https://github.com/my-org/my-repo',
        authMethods: ['token'],
      });

      expect(connection?.host).toBe('github.com');
      expect(connection?.auth.method).toBe('token');
    });

    it('hides connections that match a different plugin', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'enterprise.example.com',
            match: { plugins: ['scaffolder'] },
            auth: [
              {
                method: 'app',
                appId: 1,
                privateKey: 'pk-enterprise',
                clientId: 'client-enterprise',
                clientSecret: 'secret-enterprise',
              },
            ],
          },
        ]),
      });

      await expect(
        service.forPlugin('catalog').find({
          type: 'github',
          url: 'https://enterprise.example.com/foo',
          authMethods: ['app'],
        }),
      ).rejects.toThrow(/Connection not found/);
    });

    it('exposes connections to the plugin named in their match rule', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'enterprise.example.com',
            match: { plugins: ['scaffolder'] },
            auth: [
              {
                method: 'app',
                appId: 1,
                privateKey: 'pk-enterprise',
                clientId: 'client-enterprise',
                clientSecret: 'secret-enterprise',
              },
            ],
          },
        ]),
      });

      const connection = await service.forPlugin('scaffolder').find({
        type: 'github',
        url: 'https://enterprise.example.com/foo',
        authMethods: ['app'],
      });

      expect(connection?.host).toBe('enterprise.example.com');
      expect(connection?.auth.method).toBe('app');
    });

    it('narrows auth methods per plugin when auth has its own match rules', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'split.example.com',
            auth: [
              {
                method: 'token',
                token: 'split-token',
                match: { plugins: ['catalog'] },
              },
              {
                method: 'app',
                appId: 2,
                privateKey: 'pk-split',
                clientId: 'client-split',
                clientSecret: 'secret-split',
                match: { plugins: ['scaffolder'] },
              },
            ],
          },
        ]),
      });

      const splitForCatalog = await service.forPlugin('catalog').find({
        type: 'github',
        url: 'https://split.example.com/foo',
        authMethods: ['token', 'app'],
      });
      const splitForScaffolder = await service.forPlugin('scaffolder').find({
        type: 'github',
        url: 'https://split.example.com/foo',
        authMethods: ['token', 'app'],
      });

      expect(splitForCatalog?.auth.method).toBe('token');
      expect(splitForScaffolder?.auth.method).toBe('app');
    });

    it('throws from find for hosts that are not configured', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'github.com',
            auth: [{ method: 'token', token: 'public-token' }],
          },
        ]),
      });

      await expect(
        service.forPlugin('catalog').find({
          type: 'github',
          url: 'https://missing.example.com/foo',
          authMethods: ['token'],
        }),
      ).rejects.toThrow(/Connection not found for type "github"/);
    });
  });

  describe('auth specificity', () => {
    it('prefers a plugin-matched auth entry over an unmatched one of the same method', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'specific.example.com',
            auth: [
              { method: 'token', token: 'general-token' },
              {
                method: 'token',
                token: 'catalog-token',
                match: { plugins: ['catalog'] },
              },
            ],
          },
        ]),
      });

      const connection = await service.forPlugin('catalog').find({
        type: 'github',
        url: 'https://specific.example.com/foo',
        authMethods: ['token'],
      });

      expect(connection?.auth.method).toBe('token');
      expect((connection?.auth as { token: string }).token).toBe(
        'catalog-token',
      );
    });

    it('falls back to the unmatched auth entry for a plugin without its own match', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'specific.example.com',
            auth: [
              {
                method: 'token',
                token: 'catalog-token',
                match: { plugins: ['catalog'] },
              },
              { method: 'token', token: 'general-token' },
            ],
          },
        ]),
      });

      const connection = await service.forPlugin('scaffolder').find({
        type: 'github',
        url: 'https://specific.example.com/foo',
        authMethods: ['token'],
      });

      expect((connection?.auth as { token: string }).token).toBe(
        'general-token',
      );
    });

    it('should always return the first auth', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'gitlab',
            host: 'gitlab.com',
            auth: [
              { method: 'token', token: 'first-token' },
              { method: 'token', token: 'second-token' },
            ],
          },
        ]),
      });

      const connection = await service.forPlugin('catalog').find({
        type: 'gitlab',
        url: 'https://gitlab.com/my-org/my-repo',
        authMethods: ['token'],
      });

      expect(connection?.auth.method).toBe('token');
      expect((connection?.auth as { token: string }).token).toBe('first-token');
    });

    it('returns the auth scoped to the requesting plugin when auths are split by plugin', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'gitlab',
            host: 'gitlab.com',
            auth: [
              {
                method: 'token',
                token: 'scaffolder-token',
                match: { plugins: ['scaffolder'] },
              },
              {
                method: 'token',
                token: 'catalog-token',
                match: { plugins: ['catalog'] },
              },
            ],
          },
        ]),
      });

      const forCatalog = await service.forPlugin('catalog').find({
        type: 'gitlab',
        url: 'https://gitlab.com/my-org/my-repo',
        authMethods: ['token'],
      });
      const forScaffolder = await service.forPlugin('scaffolder').find({
        type: 'gitlab',
        url: 'https://gitlab.com/my-org/my-repo',
        authMethods: ['token'],
      });

      expect((forCatalog?.auth as { token: string }).token).toBe(
        'catalog-token',
      );
      expect((forScaffolder?.auth as { token: string }).token).toBe(
        'scaffolder-token',
      );
    });
  });

  describe('legacy integrations', () => {
    it('merges legacy and connections entries when types do not conflict', async () => {
      const logger = mockServices.logger.mock();
      const service = DefaultConnectionsService.create({
        logger,
        config: mockServices.rootConfig({
          data: {
            integrations: {
              github: [
                {
                  host: 'enterprise.example.com',
                  apiBaseUrl: 'https://enterprise.example.com/api/v3',
                  token: 'enterprise-token',
                  apps: [
                    {
                      appId: 7,
                      privateKey: 'pk',
                      clientId: 'client',
                      clientSecret: 'secret',
                    },
                  ],
                },
              ],
            },
            connections: [
              {
                type: 'gitlab',
                host: 'gitlab.com',
                auth: [{ method: 'token', token: 'connections-gl-token' }],
              },
            ],
          },
        }),
      });
      const catalog = service.forPlugin('catalog');

      const gh = await catalog.find({
        type: 'github',
        url: 'https://enterprise.example.com/foo',
        authMethods: ['token', 'app'],
      });
      // matchAuth's priority chain prefers `app` over `token` when an app
      // is available.
      expect(gh?.host).toBe('enterprise.example.com');
      expect(gh?.apiBaseUrl).toBe('https://enterprise.example.com/api/v3');
      expect(gh?.auth.method).toBe('app');

      const gl = await catalog.find({
        type: 'gitlab',
        url: 'https://gitlab.com/foo',
        authMethods: ['token'],
      });
      expect(gl?.host).toBe('gitlab.com');
      expect((gl?.auth as { token: string }).token).toBe(
        'connections-gl-token',
      );

      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('discards all legacy entries of a conflicting type and logs one warning', async () => {
      const logger = mockServices.logger.mock();
      const service = DefaultConnectionsService.create({
        logger,
        config: mockServices.rootConfig({
          data: {
            integrations: {
              github: [
                { host: 'a.example.com', token: 'a' },
                { host: 'b.example.com', token: 'b' },
                { host: 'c.example.com', token: 'c' },
              ],
            },
            connections: [
              {
                type: 'github',
                host: 'config.example.com',
                auth: [{ method: 'token', token: 'config-token' }],
              },
            ],
          },
        }),
      });
      const catalog = service.forPlugin('catalog');

      for (const url of [
        'https://a.example.com/foo',
        'https://b.example.com/foo',
        'https://c.example.com/foo',
      ]) {
        await expect(
          catalog.find({
            type: 'github',
            url,
            authMethods: ['token'],
          }),
        ).rejects.toThrow(/Connection not found/);
      }

      const kept = await catalog.find({
        type: 'github',
        url: 'https://config.example.com/foo',
        authMethods: ['token'],
      });
      expect(kept?.host).toBe('config.example.com');
      expect((kept?.auth as { token: string }).token).toBe('config-token');

      expect(logger.warn).toHaveBeenCalledTimes(1);
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('github'),
      );
    });
  });

  describe('authMethods as capability declaration', () => {
    it('returns the unauthenticated connection when authMethods includes "none"', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'public.example.com',
            auth: [{ method: 'none' }],
          },
        ]),
      });

      const connection = await service.forPlugin('catalog').find({
        type: 'github',
        url: 'https://public.example.com/foo',
        authMethods: ['none'],
      });
      expect(connection?.host).toBe('public.example.com');
      expect(connection?.auth.method).toBe('none');
    });

    it("returns the connection when the chosen method is in the caller's declared list", async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'shared.example.com',
            auth: [
              { method: 'token', token: 'shared-token' },
              {
                method: 'app',
                appId: 3,
                privateKey: 'pk-shared',
                clientId: 'client-shared',
                clientSecret: 'secret-shared',
              },
            ],
          },
        ]),
      });

      const connection = await service.forPlugin('catalog').find({
        type: 'github',
        url: 'https://shared.example.com/foo',
        authMethods: ['token', 'app'],
      });
      // matchAuth picks `app` from shared.example.com (priority chain).
      expect(connection?.auth.method).toBe('app');
    });

    it("throws when the chosen method is not in the caller's declared list", async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'github.com',
            auth: [{ method: 'token', token: 'public-token' }],
          },
        ]),
      });

      await expect(
        service.forPlugin('catalog').find({
          type: 'github',
          url: 'https://github.com/foo',
          authMethods: ['app'],
        }),
      ).rejects.toThrow(
        /Connection not found for type "github" with auth method "token"/,
      );
    });

    it('throws when plugin filtering leaves only auth that is not in the declared list', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'split.example.com',
            auth: [
              {
                method: 'token',
                token: 'split-token',
                match: { plugins: ['catalog'] },
              },
              {
                method: 'app',
                appId: 2,
                privateKey: 'pk-split',
                clientId: 'client-split',
                clientSecret: 'secret-split',
                match: { plugins: ['scaffolder'] },
              },
            ],
          },
        ]),
      });

      // catalog only sees 'token' on split.example.com (app is scaffolder-only).
      // Caller declares ['app'] — capability mismatch.
      await expect(
        service.forPlugin('catalog').find({
          type: 'github',
          url: 'https://split.example.com/foo',
          authMethods: ['app'],
        }),
      ).rejects.toThrow(
        /Connection not found for type "github" with auth method "token"/,
      );
    });
  });

  describe('invalid input', () => {
    it('throws an InputError when the url cannot be parsed', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'github.com',
            auth: [{ method: 'token', token: 'public-token' }],
          },
        ]),
      });

      await expect(
        service.forPlugin('catalog').find({
          type: 'github',
          url: 'not a url',
          authMethods: ['token'],
        }),
      ).rejects.toThrow(/Invalid url/);
    });
  });

  describe('title', () => {
    it('uses the configured title when provided', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'github.com',
            title: 'GitHub Production',
            auth: [{ method: 'token', token: 'my-token' }],
          },
        ]),
      });

      const connection = await service.forPlugin('catalog').find({
        type: 'github',
        url: 'https://github.com/my-org/my-repo',
        authMethods: ['token'],
      });

      expect(connection?.title).toBe('GitHub Production');
    });

    it('defaults to the provider display name for a single connection of that type', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'github.com',
            auth: [{ method: 'token', token: 'my-token' }],
          },
        ]),
      });

      const connection = await service.forPlugin('catalog').find({
        type: 'github',
        url: 'https://github.com/my-org/my-repo',
        authMethods: ['token'],
      });

      expect(connection?.title).toBe('GitHub');
    });

    it('includes the host when multiple connections share a type', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'github.com',
            auth: [{ method: 'token', token: 'public-token' }],
          },
          {
            type: 'github',
            host: 'ghe.acme.com',
            auth: [{ method: 'token', token: 'enterprise-token' }],
          },
        ]),
      });

      const pub = await service.forPlugin('catalog').find({
        type: 'github',
        url: 'https://github.com/my-org/my-repo',
        authMethods: ['token'],
      });
      const ent = await service.forPlugin('catalog').find({
        type: 'github',
        url: 'https://ghe.acme.com/my-org/my-repo',
        authMethods: ['token'],
      });

      expect(pub?.title).toBe('GitHub (github.com)');
      expect(ent?.title).toBe('GitHub (ghe.acme.com)');
    });

    it('does not override a configured title even when multiple connections share a type', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'github.com',
            title: 'Public GitHub',
            auth: [{ method: 'token', token: 'public-token' }],
          },
          {
            type: 'github',
            host: 'ghe.acme.com',
            auth: [{ method: 'token', token: 'enterprise-token' }],
          },
        ]),
      });

      const pub = await service.forPlugin('catalog').find({
        type: 'github',
        url: 'https://github.com/my-org/my-repo',
        authMethods: ['token'],
      });
      const ent = await service.forPlugin('catalog').find({
        type: 'github',
        url: 'https://ghe.acme.com/my-org/my-repo',
        authMethods: ['token'],
      });

      expect(pub?.title).toBe('Public GitHub');
      expect(ent?.title).toBe('GitHub (ghe.acme.com)');
    });
  });

  describe('auth title', () => {
    it('uses the configured auth title when provided', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'github.com',
            auth: [
              {
                method: 'token',
                title: 'Production Token',
                token: 'my-token',
              },
            ],
          },
        ]),
      });

      const connection = await service.forPlugin('catalog').find({
        type: 'github',
        url: 'https://github.com/my-org/my-repo',
        authMethods: ['token'],
      });

      expect(connection?.auth.title).toBe('Production Token');
    });

    it('defaults auth title from the auth method definition', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'github.com',
            auth: [
              {
                method: 'token',
                token: 'my-token',
              },
            ],
          },
        ]),
      });

      const connection = await service.forPlugin('catalog').find({
        type: 'github',
        url: 'https://github.com/my-org/my-repo',
        authMethods: ['token'],
      });

      expect(connection?.auth.title).toBe('Token');
    });

    it('keeps auth title after plugin auth filtering', async () => {
      const service = DefaultConnectionsService.create({
        logger: mockServices.logger.mock(),
        config: mockConnectionsConfig([
          {
            type: 'github',
            host: 'github.com',
            auth: [
              {
                method: 'token',
                title: 'Catalog Token',
                token: 'catalog-token',
                match: { plugins: ['catalog'] },
              },
              {
                method: 'app',
                appId: 1,
                privateKey: 'pk',
                clientId: 'client',
                clientSecret: 'secret',
                orgs: ['other-org'],
                match: { plugins: ['other-plugin'] },
              },
            ],
          },
        ]),
      });

      const connection = await service.forPlugin('catalog').find({
        type: 'github',
        url: 'https://github.com/my-org/my-repo',
        authMethods: ['token'],
      });

      expect(connection?.auth.title).toBe('Catalog Token');
    });
  });

  describe('config validation', () => {
    it('rejects a connection with an empty auth array', () => {
      expect(() =>
        DefaultConnectionsService.create({
          logger: mockServices.logger.mock(),
          config: mockConnectionsConfig([
            {
              type: 'github',
              host: 'github.com',
              auth: [],
            },
          ]),
        }),
      ).toThrow(
        /Invalid connection of type "github".*must configure at least one auth method/s,
      );
    });

    it('throws with the failing field when a connection is missing a required value', () => {
      expect(() =>
        DefaultConnectionsService.create({
          logger: mockServices.logger.mock(),
          config: mockConnectionsConfig([
            {
              type: 'github',
              host: 'github.com',
              // Token auth is missing the required `token` field.
              auth: [{ method: 'token' }],
            },
          ]),
        }),
      ).toThrow(/Invalid connection of type "github".*at auth\[0\]\.token/s);
    });

    it('throws with the offending field when a connection has an unknown property', () => {
      expect(() =>
        DefaultConnectionsService.create({
          logger: mockServices.logger.mock(),
          config: mockConnectionsConfig([
            {
              type: 'github',
              host: 'github.com',
              host2: 'github.com',
              auth: [{ method: 'token', token: 'abc' }],
            },
          ]),
        }),
      ).toThrow(
        /Invalid connection of type "github".*Unrecognized key: "host2"/s,
      );
    });
  });
});
