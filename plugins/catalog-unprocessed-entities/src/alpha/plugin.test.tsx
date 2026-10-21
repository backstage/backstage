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
  ApiBlueprint,
  coreExtensionData,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/frontend-plugin-api';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { CatalogUnprocessedEntitiesClient } from '@backstage/plugin-catalog-unprocessed-entities-common';

import plugin, {
  catalogUnprocessedEntitiesApi,
  catalogUnprocessedEntitiesPage,
  unprocessedEntitiesDevToolsContent,
} from './plugin';
import { catalogUnprocessedEntitiesApiRef } from '../api';

describe('catalog-unprocessed-entities alpha plugin', () => {
  describe('plugin', () => {
    it('is defined with the correct pluginId', () => {
      expect(plugin).toBeDefined();
      expect(plugin.pluginId).toBe('catalog-unprocessed-entities');
    });
  });

  describe('catalogUnprocessedEntitiesApi', () => {
    it('registers the catalogUnprocessedEntitiesApiRef', () => {
      const tester = createExtensionTester(catalogUnprocessedEntitiesApi);
      const apiFactory = tester.get(ApiBlueprint.dataRefs.factory);

      expect(apiFactory.api).toBe(catalogUnprocessedEntitiesApiRef);
    });

    it('declares discoveryApi and fetchApi as deps', () => {
      const tester = createExtensionTester(catalogUnprocessedEntitiesApi);
      const apiFactory = tester.get(ApiBlueprint.dataRefs.factory);

      expect(apiFactory.deps).toMatchObject({
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      });
    });

    it('factory produces a CatalogUnprocessedEntitiesClient', () => {
      const tester = createExtensionTester(catalogUnprocessedEntitiesApi);
      const apiFactory = tester.get(ApiBlueprint.dataRefs.factory);

      const instance = apiFactory.factory({
        discoveryApi: { getBaseUrl: jest.fn() } as any,
        fetchApi: { fetch: jest.fn() } as any,
      });

      expect(instance).toBeInstanceOf(CatalogUnprocessedEntitiesClient);
    });
  });

  describe('catalogUnprocessedEntitiesPage', () => {
    it('is disabled by default', () => {
      expect(catalogUnprocessedEntitiesPage).toMatchObject({ disabled: true });
    });

    it('attaches to app/routes', () => {
      expect(catalogUnprocessedEntitiesPage).toMatchObject({
        attachTo: { id: 'app/routes', input: 'routes' },
      });
    });

    it('mounts at /catalog-unprocessed-entities', () => {
      const tester = createExtensionTester(catalogUnprocessedEntitiesPage);
      const path = tester.get(coreExtensionData.routePath);
      expect(path).toBe('/catalog-unprocessed-entities');
    });
  });

  describe('unprocessedEntitiesDevToolsContent', () => {
    it('attaches to the devtools page', () => {
      expect(unprocessedEntitiesDevToolsContent).toMatchObject({
        attachTo: { id: 'page:devtools', input: 'pages' },
      });
    });

    it('mounts at the unprocessed-entities sub-path', () => {
      const tester = createExtensionTester(unprocessedEntitiesDevToolsContent);
      const path = tester.get(coreExtensionData.routePath);
      expect(path).toBe('unprocessed-entities');
    });
  });
});
