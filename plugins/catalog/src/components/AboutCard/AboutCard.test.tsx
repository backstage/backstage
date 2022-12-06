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

import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/core-app-api';
import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import {
  catalogApiRef,
  EntityProvider,
  CatalogApi,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import React from 'react';
import { viewTechDocRouteRef } from '../../routes';
import { AboutCard } from './AboutCard';

describe('<AboutCard />', () => {
  const catalogApi: jest.Mocked<CatalogApi> = {
    getLocationById: jest.fn(),
    getEntityByName: jest.fn(),
    getEntities: jest.fn(),
    addLocation: jest.fn(),
    getLocationByRef: jest.fn(),
    removeEntityByUid: jest.fn(),
    refreshEntity: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders info', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        description: 'This is the description',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
      relations: [
        {
          type: RELATION_OWNED_BY,
          targetRef: 'user:default/guest',
          target: {
            kind: 'user',
            name: 'guest',
            namespace: 'default',
          },
        },
      ],
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            scmIntegrationsApiRef,
            ScmIntegrationsApi.fromConfig(
              new ConfigReader({
                integrations: {},
              }),
            ),
          ],
          [catalogApiRef, catalogApi],
        ]}
      >
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('service')).toBeInTheDocument();
    expect(screen.getByText('user:guest')).toBeInTheDocument();
    expect(screen.getByText('production')).toBeInTheDocument();
    expect(screen.getByText('This is the description')).toBeInTheDocument();
  });

  it('renders "view source" link', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        annotations: {
          'backstage.io/source-location':
            'url:https://github.com/backstage/backstage/blob/master/software.yaml',
        },
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            scmIntegrationsApiRef,
            ScmIntegrationsApi.fromConfig(
              new ConfigReader({
                integrations: {
                  github: [
                    {
                      host: 'github.com',
                      token: '...',
                    },
                  ],
                },
              }),
            ),
          ],
          [catalogApiRef, catalogApi],
        ]}
      >
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(screen.getByText('View Source').closest('a')).toHaveAttribute(
      'href',
      'https://github.com/backstage/backstage/blob/master/software.yaml',
    );
  });

  it('renders "edit metadata" button', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        annotations: {
          'backstage.io/edit-url':
            'https://github.com/backstage/backstage/edit/master/software.yaml',
        },
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            scmIntegrationsApiRef,
            ScmIntegrationsApi.fromConfig(
              new ConfigReader({
                integrations: {
                  github: [
                    {
                      host: 'github.com',
                      token: '...',
                    },
                  ],
                },
              }),
            ),
          ],
          [catalogApiRef, catalogApi],
        ]}
      >
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const editLink = screen.getByTitle('Edit Metadata').closest('a');
    expect(editLink).toHaveAttribute(
      'href',
      'https://github.com/backstage/backstage/edit/master/software.yaml',
    );
  });

  it('renders disabled "view source" link', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            scmIntegrationsApiRef,
            ScmIntegrationsApi.fromConfig(new ConfigReader({})),
          ],
          [catalogApiRef, catalogApi],
        ]}
      >
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(screen.getByText('View Source')).toBeVisible();
    expect(screen.getByText('View Source').closest('a')).toBeNull();
  });

  it.each([
    'url:https://backstage.io/catalog-info.yaml',
    'file:../../catalog-info.yaml',
  ])('triggers a refresh for %s', async location => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location': location,
        },
        name: 'software',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            scmIntegrationsApiRef,
            ScmIntegrationsApi.fromConfig(new ConfigReader({})),
          ],
          [catalogApiRef, catalogApi],
        ]}
      >
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(catalogApi.refreshEntity).not.toHaveBeenCalledWith(
      'component:default/software',
    );

    await userEvent.click(screen.getByTitle('Schedule entity refresh'));

    expect(catalogApi.refreshEntity).toHaveBeenCalledWith(
      'component:default/software',
    );
  });

  it('should not render refresh button if the location is not an url or file', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            scmIntegrationsApiRef,
            ScmIntegrationsApi.fromConfig(new ConfigReader({})),
          ],
          [catalogApiRef, catalogApi],
        ]}
      >
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(
      screen.queryByTitle('Schedule entity refresh'),
    ).not.toBeInTheDocument();
  });

  it('renders techdocs link', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        annotations: {
          'backstage.io/techdocs-ref': './',
        },
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            scmIntegrationsApiRef,
            ScmIntegrationsApi.fromConfig(
              new ConfigReader({
                integrations: {
                  github: [
                    {
                      host: 'github.com',
                      token: '...',
                    },
                  ],
                },
              }),
            ),
          ],
          [catalogApiRef, catalogApi],
        ]}
      >
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/docs/:namespace/:kind/:name': viewTechDocRouteRef,
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('View TechDocs').closest('a')).toHaveAttribute(
      'href',
      '/docs/default/Component/software',
    );
  });

  it('renders disabled techdocs link when no docs exist', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            scmIntegrationsApiRef,
            ScmIntegrationsApi.fromConfig(
              new ConfigReader({
                integrations: {
                  github: [
                    {
                      host: 'github.com',
                      token: '...',
                    },
                  ],
                },
              }),
            ),
          ],
          [catalogApiRef, catalogApi],
        ]}
      >
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('View TechDocs')).toBeVisible();
    expect(screen.getByText('View TechDocs').closest('a')).toBeNull();
  });

  it('renders disabled techdocs link when route is not bound', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        annotations: {
          'backstage.io/techdocs-ref': './',
        },
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            scmIntegrationsApiRef,
            ScmIntegrationsApi.fromConfig(
              new ConfigReader({
                integrations: {
                  github: [
                    {
                      host: 'github.com',
                      token: '...',
                    },
                  ],
                },
              }),
            ),
          ],
          [catalogApiRef, catalogApi],
        ]}
      >
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('View TechDocs')).toBeVisible();
    expect(screen.getByText('View TechDocs').closest('a')).toBeNull();
  });
});
