/*
 * Copyright 2020 The Backstage Authors
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

import { ApiEntity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';
import React from 'react';
import { ApiDocsConfig, apiDocsConfigRef } from '../../config';
import { OpenApiDefinitionWidget } from '../OpenApiDefinitionWidget';
import { ApiDefinitionCard } from './ApiDefinitionCard';

// Make sure this is in the require cache before the async rendering happens
import '../OpenApiDefinitionWidget/OpenApiDefinition';

describe('<ApiDefinitionCard />', () => {
  const apiDocsConfig: jest.Mocked<ApiDocsConfig> = {
    getApiDefinitionWidget: jest.fn(),
  } as any;
  let Wrapper: React.ComponentType<React.PropsWithChildren<{}>>;

  beforeEach(() => {
    Wrapper = ({ children }: { children?: React.ReactNode }) => (
      <TestApiProvider apis={[[apiDocsConfigRef, apiDocsConfig]]}>
        {children}
      </TestApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  it('renders API', async () => {
    const definition = `
openapi: "3.0.0"
info:
  version: 1.0.0
  title: Artist API
  license:
    name: MIT
servers:
  - url: http://artist.spotify.net/v1
paths:
  /artists:
    get:
      summary: List all artists
      responses:
        "200":
          description: Success
        `;
    const apiEntity: ApiEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: {
        name: 'my-name',
        title: 'My Name',
      },
      spec: {
        type: 'openapi',
        lifecycle: '...',
        owner: '...',
        definition,
      },
    };
    apiDocsConfig.getApiDefinitionWidget.mockReturnValue({
      type: 'openapi',
      title: 'OpenAPI',
      rawLanguage: 'yaml',
      component: definitionString => (
        <OpenApiDefinitionWidget definition={definitionString} />
      ),
    });

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={apiEntity}>
          <ApiDefinitionCard />
        </EntityProvider>
      </Wrapper>,
    );

    await waitFor(() => {
      expect(getByText(/My Name/i)).toBeInTheDocument();
      expect(getByText(/OpenAPI/)).toBeInTheDocument();
      expect(getByText(/Raw/i)).toBeInTheDocument();
      expect(getByText(/List all artists/i)).toBeInTheDocument();
    });
  });

  it('fallback to plain view', async () => {
    const apiEntity: ApiEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: {
        name: 'my-name',
        title: 'My Name',
      },
      spec: {
        type: 'custom-type',
        lifecycle: '...',
        owner: '...',
        definition: 'Custom Definition',
      },
    };

    const { getByText, getAllByText } = await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={apiEntity}>
          <ApiDefinitionCard />
        </EntityProvider>
      </Wrapper>,
    );

    expect(getByText(/My Name/i)).toBeInTheDocument();
    expect(getByText(/custom-type/i)).toBeInTheDocument();
    expect(
      getAllByText(
        (_text, element) => element?.textContent === 'Custom Definition',
      ).length,
    ).toBeGreaterThan(0);
  });
});
