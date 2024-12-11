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

import { TokenManager, loggerToWinstonLogger } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { DefaultTechDocsCollator } from './DefaultTechDocsCollator';
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { ConfigReader } from '@backstage/config';
import { TECHDOCS_ANNOTATION } from '@backstage/plugin-techdocs-common';
import { DiscoveryService } from '@backstage/backend-plugin-api';

const logger = loggerToWinstonLogger(mockServices.logger.mock());

const mockSearchDocIndex = {
  config: {
    lang: ['en'],
    min_search_length: 3,
    prebuild_index: false,
    separator: '[\\s\\-]+',
  },
  docs: [
    {
      location: '',
      text: 'docs docs docs',
      title: 'Home',
    },
    {
      location: 'local-development/',
      text: 'Docs for first subtitle',
      title: 'Local development',
    },
    {
      location: 'local-development/#development',
      text: 'Docs for sub-subtitle',
      title: 'Development',
    },
  ],
};

const expectedEntities: Entity[] = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      title: 'Test Entity with Docs!',
      name: 'test-entity-with-docs',
      description: 'Documented description',
      annotations: {
        [TECHDOCS_ANNOTATION]: './',
      },
    },
    spec: {
      type: 'dog',
      lifecycle: 'experimental',
      owner: 'someone',
    },
  },
];

describe('TechDocs Collator', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

  describe('DefaultTechDocsCollator with legacyPathCasing configuration', () => {
    let mockDiscoveryApi: jest.Mocked<DiscoveryService>;
    let mockTokenManager: jest.Mocked<TokenManager>;
    let collator: DefaultTechDocsCollator;

    beforeEach(() => {
      mockDiscoveryApi = {
        getBaseUrl: jest.fn().mockResolvedValue('http://test-backend'),
        getExternalBaseUrl: jest.fn(),
      };
      mockTokenManager = {
        getToken: jest.fn().mockResolvedValue({ token: '' }),
        authenticate: jest.fn(),
      };
      const mockConfig = new ConfigReader({
        techdocs: {
          legacyUseCaseSensitiveTripletPaths: true,
        },
      });
      collator = DefaultTechDocsCollator.fromConfig(mockConfig, {
        discovery: mockDiscoveryApi,
        tokenManager: mockTokenManager,
        logger,
        legacyPathCasing: true,
      });

      worker.use(
        http.get(
          'http://test-backend/static/docs/default/Component/test-entity-with-docs/search/search_index.json',
          () => HttpResponse.json(mockSearchDocIndex),
        ),
        http.get('http://test-backend/entities', () =>
          HttpResponse.json(expectedEntities),
        ),
      );
    });

    it('fetches from the configured catalog and tech docs services', async () => {
      const documents = await collator.execute();
      expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('catalog');
      expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('techdocs');
      expect(documents).toHaveLength(mockSearchDocIndex.docs.length);
    });

    it('should create documents for each tech docs search index', async () => {
      const documents = await collator.execute();
      const entity = expectedEntities[0];
      documents.forEach((document, idx) => {
        expect(document).toMatchObject({
          title: mockSearchDocIndex.docs[idx].title,
          location: `/docs/default/Component/${entity.metadata.name}/${mockSearchDocIndex.docs[idx].location}`,
          text: mockSearchDocIndex.docs[idx].text,
          namespace: 'default',
          entityTitle: entity!.metadata.title,
          componentType: entity!.spec!.type,
          lifecycle: entity!.spec!.lifecycle,
          owner: '',
          kind: entity.kind,
          name: entity.metadata.name,
        });
      });
    });
  });

  describe('DefaultTechDocsCollator', () => {
    let mockDiscoveryApi: jest.Mocked<DiscoveryService>;
    let mockTokenManager: jest.Mocked<TokenManager>;
    let collator: DefaultTechDocsCollator;

    beforeEach(() => {
      mockDiscoveryApi = {
        getBaseUrl: jest.fn().mockResolvedValue('http://test-backend'),
        getExternalBaseUrl: jest.fn(),
      };
      mockTokenManager = {
        getToken: jest.fn().mockResolvedValue({ token: '' }),
        authenticate: jest.fn(),
      };
      collator = DefaultTechDocsCollator.fromConfig(new ConfigReader({}), {
        discovery: mockDiscoveryApi,
        tokenManager: mockTokenManager,
        logger,
      });

      worker.use(
        http.get(
          'http://test-backend/static/docs/default/component/test-entity-with-docs/search/search_index.json',
          () => HttpResponse.json(mockSearchDocIndex),
        ),
        http.get('http://test-backend/entities', () =>
          HttpResponse.json(expectedEntities),
        ),
      );
    });

    it('should create documents for each tech docs search index', async () => {
      const documents = await collator.execute();
      const entity = expectedEntities[0];
      documents.forEach((document, idx) => {
        expect(document).toMatchObject({
          title: mockSearchDocIndex.docs[idx].title,
          location: `/docs/default/component/${entity.metadata.name}/${mockSearchDocIndex.docs[idx].location}`,
          text: mockSearchDocIndex.docs[idx].text,
          namespace: 'default',
          entityTitle: entity!.metadata.title,
          componentType: entity!.spec!.type,
          lifecycle: entity!.spec!.lifecycle,
          owner: '',
          kind: entity.kind.toLocaleLowerCase('en-US'),
          name: entity.metadata.name.toLocaleLowerCase('en-US'),
          authorization: {
            resourceRef: `component:default/${entity.metadata.name}`,
          },
        });
      });
    });

    it('maps a returned entity with a custom locationTemplate', async () => {
      const mockConfig = new ConfigReader({
        techdocs: {
          legacyUseCaseSensitiveTripletPaths: true,
        },
      });
      // Provide an alternate location template.
      collator = DefaultTechDocsCollator.fromConfig(mockConfig, {
        discovery: mockDiscoveryApi,
        tokenManager: mockTokenManager,
        locationTemplate: '/software/:name',
        logger,
      });

      const documents = await collator.execute();
      expect(documents[0]).toMatchObject({
        location: '/software/test-entity-with-docs',
      });
    });
  });
});
