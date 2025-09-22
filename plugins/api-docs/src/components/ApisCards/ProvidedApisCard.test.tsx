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

import { Entity, RELATION_PROVIDES_API } from '@backstage/catalog-model';
import {
  catalogApiRef,
  EntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';
import { PropsWithChildren, ComponentType, ReactNode } from 'react';
import { ApiDocsConfig, apiDocsConfigRef } from '../../config';
import { ProvidedApisCard } from './ProvidedApisCard';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

describe('<ProvidedApisCard />', () => {
  const apiDocsConfig: jest.Mocked<ApiDocsConfig> = {
    getApiDefinitionWidget: jest.fn(),
  } as any;
  const catalogApi = catalogApiMock.mock();
  let Wrapper: ComponentType<PropsWithChildren<{}>>;

  beforeEach(() => {
    Wrapper = ({ children }: { children?: ReactNode }) => (
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [apiDocsConfigRef, apiDocsConfig],
        ]}
      >
        {children}
      </TestApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  it('shows empty list if no relations', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'my-name',
        namespace: 'my-namespace',
      },
      relations: [],
    };

    const { getByText, getByRole, container } = await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <ProvidedApisCard />
        </EntityProvider>
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(getByText(/Provided APIs/i)).toBeInTheDocument();
    expect(getByText(/does not provide any APIs/i)).toBeInTheDocument();
    expect(getByText(/Learn how to change this/)).toBeInTheDocument();

    // Also render external link icon
    const externalLink = getByRole('link');
    expect(externalLink).toHaveAttribute(
      'href',
      'https://backstage.io/docs/features/software-catalog/descriptor-format#specprovidesapis-optional',
    );
    const externalLinkIcon: HTMLElement | null = container.querySelector(
      'svg[class*="externalLink"]',
    );
    expect(externalLink).toContainElement(externalLinkIcon);
  });

  it('shows consumed APIs', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'my-name',
        namespace: 'my-namespace',
      },
      relations: [
        {
          targetRef: 'api:my-namespace/target-name',
          type: RELATION_PROVIDES_API,
        },
      ],
    };
    catalogApi.getEntitiesByRefs.mockResolvedValue({
      items: [
        {
          apiVersion: 'v1',
          kind: 'API',
          metadata: {
            name: 'target-name',
            namespace: 'my-namespace',
          },
          spec: {},
        },
      ],
    });

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <ProvidedApisCard />
        </EntityProvider>
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    await waitFor(() => {
      expect(getByText(/Provided APIs/i)).toBeInTheDocument();
      expect(getByText(/target-name/i)).toBeInTheDocument();
    });
  });
});
