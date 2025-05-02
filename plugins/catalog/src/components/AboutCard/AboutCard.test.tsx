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

import {
  EntityProvider,
  catalogApiRef,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import {
  TestApiProvider,
  mockApis,
  renderInTestApp,
} from '@backstage/test-utils';
import { createFromTemplateRouteRef, viewTechDocRouteRef } from '../../routes';

import { AboutCard } from './AboutCard';
import { ConfigReader } from '@backstage/core-app-api';
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { SWRConfig } from 'swr';

describe('<AboutCard />', () => {
  const catalogApi = catalogApiMock.mock();

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
          [permissionApiRef, {}],
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
          [permissionApiRef, {}],
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
          [permissionApiRef, {}],
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
          [permissionApiRef, {}],
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

  it('renders "create something similar" button', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        annotations: {
          'backstage.io/source-template': 'template:default/foo-template',
        },
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    // Return any valid value to indicate access to the template is okay.
    catalogApi.getEntityByRef.mockImplementation(async ref => {
      expect(ref).toBe('template:default/foo-template');
      return entity;
    });

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
          [permissionApiRef, {}],
        ]}
      >
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/create/templates/:namespace/:templateName':
            createFromTemplateRouteRef,
        },
      },
    );

    await waitFor(() => {
      const createSimilarLink = screen
        .getByTitle('Create something similar')
        .closest('a');
      expect(createSimilarLink).toHaveAttribute(
        'href',
        '/create/templates/default/foo-template',
      );
    });
  });

  it('should not render "create something similar" button if template does not exist', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        annotations: {
          'backstage.io/source-template': 'template:default/gone-template',
        },
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    // Return any valid value to indicate access to the template is okay.
    catalogApi.getEntityByRef.mockImplementation(async ref => {
      expect(ref).toBe('template:default/gone-template');
      return undefined;
    });

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
          [permissionApiRef, {}],
        ]}
      >
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/create/templates/:namespace/:templateName':
            createFromTemplateRouteRef,
        },
      },
    );

    expect(
      screen.queryByTitle('Create something similar'),
    ).not.toBeInTheDocument();
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
          [permissionApiRef, mockApis.permission()],
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

  it('should not render refresh button if the permission is DENY', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location':
            'url:https://backstage.io/catalog-info.yaml',
        },
        name: 'software-deny',
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
          [
            permissionApiRef,
            mockApis.permission({ authorize: AuthorizeResult.DENY }),
          ],
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
          [permissionApiRef, {}],
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

  it('renders techdocs link when 3rdparty', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        annotations: {
          'backstage.io/techdocs-entity': 'system:default/example',
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
          [permissionApiRef, {}],
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
      '/docs/default/system/example',
    );
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
          [permissionApiRef, {}],
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
          [permissionApiRef, {}],
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
          [permissionApiRef, {}],
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

  it('renders launch template link', async () => {
    const entity = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: {
        name: 'create-react-app-template',
        namespace: 'default',
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
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <EntityProvider entity={entity}>
          <AboutCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/create/templates/:namespace/:templateName':
            createFromTemplateRouteRef,
        },
      },
    );

    expect(screen.getByText('Launch Template')).toBeVisible();
    expect(screen.getByText('Launch Template').closest('a')).toHaveAttribute(
      'href',
      '/create/templates/default/create-react-app-template',
    );
  });
  it('renders disabled launch template button if user has insufficient permissions', async () => {
    const entity = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: {
        name: 'create-react-app-template',
        namespace: 'default',
      },
    };
    await renderInTestApp(
      <SWRConfig value={{ provider: () => new Map() }}>
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
            [
              permissionApiRef,
              mockApis.permission({ authorize: AuthorizeResult.DENY }),
            ],
          ]}
        >
          <EntityProvider entity={entity}>
            <AboutCard />
          </EntityProvider>
        </TestApiProvider>
      </SWRConfig>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/create/templates/:namespace/:templateName':
            createFromTemplateRouteRef,
        },
      },
    );

    expect(screen.getByText('Launch Template')).toBeVisible();
    expect(screen.getByText('Launch Template').closest('a')).toBeNull();
  });

  it.each([
    {
      testName: 'entity is not a template',
      entity: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Component',
        metadata: {
          name: 'create-react-app-template',
          namespace: 'default',
        },
      },
    },
    {
      testName: 'apiVersion is not scaffolder.backstage.io/v1beta3',
      entity: {
        apiVersion: 'v1',
        kind: 'Template',
        metadata: {
          name: 'create-react-app-template',
          namespace: 'default',
        },
      },
    },
  ])(
    'should not render launch template link when $testName',
    async ({ entity }) => {
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
            [permissionApiRef, {}],
          ]}
        >
          <EntityProvider entity={entity}>
            <AboutCard />
          </EntityProvider>
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
            '/create/templates/:namespace/:templateName':
              createFromTemplateRouteRef,
          },
        },
      );

      expect(screen.queryByText('Launch Template')).toBeNull();
    },
  );

  it('renders disabled launch template link when route is not bound', async () => {
    const entity = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: {
        name: 'create-react-app-template',
        namespace: 'default',
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
          [permissionApiRef, {}],
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

    expect(screen.getByText('Launch Template')).toBeVisible();
    expect(screen.getByText('Launch Template').closest('a')).toBeNull();
  });
});
