/*
 * Copyright 2025 The Backstage Authors
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

import { screen } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { ApiEntity, ComponentEntity } from '@backstage/catalog-model';
import { createTestEntityPage } from '@backstage/plugin-catalog-react/testUtils';
import apiDocsPlugin from './alpha';

const apiDocsDefinitionEntityCard = apiDocsPlugin.getExtension(
  'entity-card:api-docs/definition',
);
const apiDocsDefinitionEntityContent = apiDocsPlugin.getExtension(
  'entity-content:api-docs/definition',
);
const apiDocsConfigApi = apiDocsPlugin.getExtension('api:api-docs/config');

describe('api-docs plugin entity extensions', () => {
  describe('apiDocsDefinitionEntityCard', () => {
    it('should render for API entities', async () => {
      const entity: ApiEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'API',
        metadata: {
          name: 'my-api',
          title: 'My API',
        },
        spec: {
          type: 'openapi',
          lifecycle: 'production',
          owner: 'team-a',
          definition:
            'openapi: 3.0.0\ninfo:\n  title: My API\n  version: 1.0.0',
        },
      };

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity }),
          apiDocsConfigApi,
          apiDocsDefinitionEntityCard,
        ],
      });

      expect(await screen.findByText('My API')).toBeInTheDocument();
    });

    it('should not render for non-API entities', async () => {
      const entity: ComponentEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'team-a',
        },
      };

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity }),
          apiDocsConfigApi,
          apiDocsDefinitionEntityCard,
        ],
      });

      expect(
        await screen.findByTestId('empty-entity-page'),
      ).toBeInTheDocument();
    });

    it('should display the API definition content', async () => {
      const entity: ApiEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'API',
        metadata: {
          name: 'pet-api',
        },
        spec: {
          type: 'openapi',
          lifecycle: 'production',
          owner: 'team-a',
          definition: JSON.stringify({
            openapi: '3.0.0',
            info: { title: 'Pet Store API', version: '1.0.0' },
          }),
        },
      };

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity }),
          apiDocsConfigApi,
          apiDocsDefinitionEntityCard,
        ],
      });

      expect(await screen.findByText('pet-api')).toBeInTheDocument();
    });
  });

  describe('apiDocsDefinitionEntityContent', () => {
    it('should render for API entities', async () => {
      const entity: ApiEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'API',
        metadata: {
          name: 'content-api',
          title: 'Content API',
        },
        spec: {
          type: 'graphql',
          lifecycle: 'production',
          owner: 'team-b',
          definition: 'type Query { hello: String }',
        },
      };

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity }),
          apiDocsConfigApi,
          apiDocsDefinitionEntityContent,
        ],
      });

      expect(await screen.findByText('Content API')).toBeInTheDocument();
    });

    it('should not render for non-API entities', async () => {
      const entity: ComponentEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-service',
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'team-a',
        },
      };

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity }),
          apiDocsConfigApi,
          apiDocsDefinitionEntityContent,
        ],
      });

      // Content should not render for Components
      expect(
        await screen.findByTestId('empty-entity-page'),
      ).toBeInTheDocument();
    });
  });
});
