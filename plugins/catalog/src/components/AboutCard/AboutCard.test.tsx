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
import {
  ApiProvider,
  ApiRegistry,
  ConfigReader,
} from '@backstage/core-app-api';
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
import { renderInTestApp } from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { viewTechDocRouteRef } from '../../routes';
import { AboutCard } from './AboutCard';

describe('<AboutCard />', () => {
  const catalogApi: jest.Mocked<CatalogApi> = {
    getLocationById: jest.fn(),
    getEntityByName: jest.fn(),
    getEntities: jest.fn(),
    addLocation: jest.fn(),
    getLocationByEntity: jest.fn(),
    removeEntityByUid: jest.fn(),
    refreshEntity: jest.fn(),
  } as any;

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
          target: {
            kind: 'user',
            name: 'guest',
            namespace: 'default',
          },
        },
      ],
    };
    const apis = ApiRegistry.with(
      scmIntegrationsApiRef,
      ScmIntegrationsApi.fromConfig(
        new ConfigReader({
          integrations: {},
        }),
      ),
    ).with(catalogApiRef, catalogApi);

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(getByText('service')).toBeInTheDocument();
    expect(getByText('user:guest')).toBeInTheDocument();
    expect(getByText('production')).toBeInTheDocument();
    expect(getByText('This is the description')).toBeInTheDocument();
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
    const apis = ApiRegistry.with(
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
    ).with(catalogApiRef, catalogApi);

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(getByText('View Source').closest('a')).toHaveAttribute(
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
    const apis = ApiRegistry.with(
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
    ).with(catalogApiRef, catalogApi);

    const { getByTitle } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const editLink = getByTitle('Edit Metadata').closest('a');
    expect(editLink).toHaveAttribute(
      'href',
      'https://github.com/backstage/backstage/edit/master/software.yaml',
    );
  });

  it('renders without "view source" link', async () => {
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
    const apis = ApiRegistry.with(
      scmIntegrationsApiRef,
      ScmIntegrationsApi.fromConfig(new ConfigReader({})),
    ).with(catalogApiRef, catalogApi);

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(getByText('View Source').closest('a')).not.toHaveAttribute('href');
  });

  it('triggers a refresh', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location':
            'url:https://backstage.io/catalog-info.yaml',
        },
        name: 'software',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const apis = ApiRegistry.with(
      scmIntegrationsApiRef,
      ScmIntegrationsApi.fromConfig(new ConfigReader({})),
    ).with(catalogApiRef, catalogApi);

    const { getByTitle } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(catalogApi.refreshEntity).not.toHaveBeenCalledWith(
      'component:default/software',
    );

    userEvent.click(getByTitle('Schedule entity refresh'));

    expect(catalogApi.refreshEntity).toHaveBeenCalledWith(
      'component:default/software',
    );
  });

  it('should not render refresh button if the location is not an url', async () => {
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
    const apis = ApiRegistry.with(
      scmIntegrationsApiRef,
      ScmIntegrationsApi.fromConfig(new ConfigReader({})),
    ).with(catalogApiRef, catalogApi);

    const { queryByTitle } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(queryByTitle('Schedule entity refresh')).not.toBeInTheDocument();
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
    const apis = ApiRegistry.with(
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
    ).with(catalogApiRef, catalogApi);

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/docs/:namespace/:kind/:name': viewTechDocRouteRef,
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(getByText('View TechDocs').closest('a')).toHaveAttribute(
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
    const apis = ApiRegistry.with(
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
    ).with(catalogApiRef, catalogApi);

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(getByText('View TechDocs').closest('a')).not.toHaveAttribute('href');
  });

  it('renders disbaled techdocs link when route is not bound', async () => {
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
    const apis = ApiRegistry.with(
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
    ).with(catalogApiRef, catalogApi);

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(getByText('View TechDocs').closest('a')).not.toHaveAttribute('href');
  });
});
