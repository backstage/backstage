/*
 * Copyright 2023 The Backstage Authors
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

import { createSpecializedBackend } from '../../../wiring';
import { rootLoggerServiceFactory } from './rootLoggerServiceFactory';
import {
  coreServices,
  createBackendPlugin,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { schemaDiscoveryServiceRef } from '@backstage/backend-plugin-api/alpha';
import {
  ConfigSchemaPackageEntry,
  ConfigSources,
  StaticConfigSource,
} from '@backstage/config-loader';
import { transports } from 'winston';
import { rootLifecycleServiceFactory } from '../rootLifecycle';
import { lifecycleServiceFactory } from '../lifecycle';
import { loggerServiceFactory } from '../logger';

describe('rootLogger', () => {
  describe('rootLoggerServiceFactory', () => {
    afterEach(() => {
      jest.resetModules();
    });

    it('also hide secret config values coming from additional schemas', async () => {
      const additionalConfigs = {
        context: 'test',
        data: {
          secretValue: 'shouldBeHidden',
        },
      };

      const additionalSchemas = [
        {
          path: 'test',
          value: {
            type: 'object',
            properties: {
              secretValue: {
                type: 'string',
                visibility: 'secret',
              },
            },
          },
        },
      ];

      const logs: string[] = [];
      jest
        .spyOn(transports.Console.prototype, 'log')
        .mockImplementation((s: any, next: any) => {
          logs.push(s.message);
          if (next) {
            next();
          }
          return undefined;
        });

      const backend = createSpecializedBackend({
        defaultServiceFactories: [
          lifecycleServiceFactory(),
          loggerServiceFactory(),
          rootLifecycleServiceFactory(),
          rootLoggerServiceFactory(),
          createServiceFactory({
            service: coreServices.rootConfig,
            deps: {},
            async factory() {
              return await ConfigSources.toConfig(
                ConfigSources.merge([
                  ConfigSources.default({}),
                  StaticConfigSource.create(additionalConfigs),
                ]),
              );
            },
          }),
          createServiceFactory({
            service: schemaDiscoveryServiceRef,
            deps: {
              config: coreServices.rootConfig,
            },
            factory: async () => ({
              getAdditionalSchemas: async (): Promise<{
                schemas: Array<ConfigSchemaPackageEntry>;
              }> => ({
                schemas: additionalSchemas,
              }),
            }),
          }),
        ],
      });
      backend.add(
        createBackendPlugin({
          pluginId: 'test',
          register(env) {
            env.registerInit({
              deps: {
                logger: coreServices.logger,
                lifecycle: coreServices.lifecycle,
              },
              async init({ logger }) {
                logger.info('test');
                logger.info('shouldBeHidden');
              },
            });
          },
        }),
      );
      await backend.start();

      expect(logs[0]).toMatch(
        /Found \d+ new secrets in config that will be redacted/,
      );
      expect(logs[1]).toEqual('test');
      expect(logs[2]).toEqual('[REDACTED]');
    }, 30000);
  });
});
