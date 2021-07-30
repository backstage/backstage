/*
 * Copyright 2021 The Backstage Authors
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
import { addCatalogProcessor } from './addCatalogProcessor';
import { advancedCatalogFile } from './mocks/advancedCatalogFile';
import { basicCatalogFile } from './mocks/basicCatalogFile';

describe('addCatalogProcessor', () => {
  it('should add an import and builder configuration correctly to a barebones catalog backend', () => {
    expect(
      addCatalogProcessor(
        '.',
        () => basicCatalogFile,
        () => {},
      ),
    ).toMatchInlineSnapshot(`
      "import {
          CatalogBuilder,
          createRouter
      } from '@backstage/plugin-catalog-backend';
      import { Router } from 'express';
      import { PluginEnvironment } from '../types';

      import { LdapOrgReaderProcessor } from \\"@backstage/plugin-catalog-backend-module-ldap\\";

      export default async function createPlugin(env: PluginEnvironment): Promise<Router> {
          const builder = await CatalogBuilder.create(env);

          builder.addProcessor(LdapOrgReaderProcessor.fromConfig(env.config, {
              logger: env.logger.child({
                  type: \\"plugin\\",
                  plugin: \\"LDAP\\"
              })
          }));

          const {
              entitiesCatalog,
              locationsCatalog,
              locationService,
              processingEngine,
              locationAnalyzer,
          } = await builder.build();

          await processingEngine.start();

          return await createRouter({
              entitiesCatalog,
              locationsCatalog,
              locationService,
              locationAnalyzer,
              logger: env.logger,
              config: env.config,
          });
      }"
    `);
  });

  it('should add an import and builder configuration correctly to an advanced catalog backend', () => {
    expect(
      addCatalogProcessor(
        '.',
        () => advancedCatalogFile,
        () => {},
      ),
    ).toMatchInlineSnapshot(`
      "import {
          CatalogBuilder,
          createRouter,
        } from '@backstage/plugin-catalog-backend';
      import { Router } from 'express';

      import { PluginEnvironment } from '../types';

      import { SysmodelReaderProcessor } from './SysmodelReaderProcessor';

      import { LdapOrgReaderProcessor } from \\"@backstage/plugin-catalog-backend-module-ldap\\";

      export const catalog = async (env: PluginEnvironment): Promise<Router> => {
        const builder = await CatalogBuilder.create(env);

        builder.addProcessor(LdapOrgReaderProcessor.fromConfig(env.config, {
          logger: env.logger.child({
            type: \\"plugin\\",
            plugin: \\"LDAP\\"
          })
        }));

        builder.addProcessor(new SysmodelReaderProcessor(env.logger));

        const {
          entitiesCatalog,
          locationsCatalog,
          locationAnalyzer,
          locationService,
          processingEngine,
        } = await builder.setRefreshIntervalSeconds(20 * 60).build();

        await processingEngine.start();

        return await createRouter({
          entitiesCatalog,
          locationsCatalog,
          locationAnalyzer,
          locationService,
          logger: env.logger,
          config: env.config,
        });
      };"
    `);
  });
});
