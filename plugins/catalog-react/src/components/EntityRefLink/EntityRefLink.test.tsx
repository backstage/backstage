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

import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import {
  createMockAppHistory,
  createMockRouteResolutionApi,
  renderInTestApp as renderInFrontendTestApp,
} from '@backstage/frontend-test-utils';
import {
  appHistoryApiRef,
  routeResolutionApiRef,
} from '@backstage/frontend-plugin-api';
import { analyticsApiRef } from '@backstage/core-plugin-api';
import { PageMountProvider } from '@internal/frontend';
import { entityRouteRef } from '../../routes';
import { EntityRefLink } from './EntityRefLink';

describe('<EntityRefLink />', () => {
  it('renders link for entity in default namespace', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'default',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    await renderInTestApp(<EntityRefLink entityRef={entity} />, {
      mountedRoutes: {
        '/catalog/:namespace/:kind/:name/*': entityRouteRef,
      },
    });
    expect(screen.getByText('software').closest('a')).toHaveAttribute(
      'href',
      '/catalog/default/component/software',
    );
  });

  it('renders link for entity in other namespace', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'test',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    await renderInTestApp(<EntityRefLink entityRef={entity} />, {
      mountedRoutes: {
        '/catalog/:namespace/:kind/:name/*': entityRouteRef,
      },
    });
    expect(screen.getByText('test/software').closest('a')).toHaveAttribute(
      'href',
      '/catalog/test/component/software',
    );
  });

  it('renders link for entity and hides default kind', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'test',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    await renderInTestApp(
      <EntityRefLink entityRef={entity} defaultKind="Component" />,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );
    expect(screen.getByText('test/software').closest('a')).toHaveAttribute(
      'href',
      '/catalog/test/component/software',
    );
  });

  it('renders link for entity name in default namespace', async () => {
    const entityName = {
      kind: 'Component',
      namespace: 'default',
      name: 'software',
    };
    await renderInTestApp(<EntityRefLink entityRef={entityName} />, {
      mountedRoutes: {
        '/catalog/:namespace/:kind/:name/*': entityRouteRef,
      },
    });
    expect(screen.getByText('software').closest('a')).toHaveAttribute(
      'href',
      '/catalog/default/component/software',
    );
  });

  it('renders link for entity name in other namespace', async () => {
    const entityName = {
      kind: 'Component',
      namespace: 'test',
      name: 'software',
    };
    await renderInTestApp(<EntityRefLink entityRef={entityName} />, {
      mountedRoutes: {
        '/catalog/:namespace/:kind/:name/*': entityRouteRef,
      },
    });
    expect(screen.getByText('test/software').closest('a')).toHaveAttribute(
      'href',
      '/catalog/test/component/software',
    );
  });

  it('renders link for entity name and hides default kind', async () => {
    const entityName = {
      kind: 'Component',
      namespace: 'test',
      name: 'software',
    };
    await renderInTestApp(
      <EntityRefLink entityRef={entityName} defaultKind="component" />,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );
    expect(screen.getByText('test/software').closest('a')).toHaveAttribute(
      'href',
      '/catalog/test/component/software',
    );
  });

  it('renders link with custom children', async () => {
    const entityName = {
      kind: 'Component',
      namespace: 'test',
      name: 'software',
    };
    await renderInTestApp(
      <EntityRefLink entityRef={entityName} defaultKind="component">
        Custom Children
      </EntityRefLink>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );
    expect(screen.getByText('Custom Children').closest('a')).toHaveAttribute(
      'href',
      '/catalog/test/component/software',
    );
  });

  it('renders link by encoding name as URI component', async () => {
    const entityName = {
      kind: 'Compone&nt',
      namespace: 'tes[t',
      name: 'softw#are',
    };
    await renderInTestApp(
      <EntityRefLink entityRef={entityName} defaultKind="component">
        Custom Children
      </EntityRefLink>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );
    expect(screen.getByText('Custom Children')).toHaveAttribute(
      'href',
      '/catalog/tes%5Bt/compone%26nt/softw%23are',
    );
  });

  it('navigates via the app history under scoped routing', () => {
    const navigate = jest.fn();
    const appHistory = createMockAppHistory({ navigate });
    const pageMount = { basePath: '/create', routePattern: '/create' };

    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'default',
      },
    };

    render(
      <TestApiProvider
        apis={[
          [
            routeResolutionApiRef,
            createMockRouteResolutionApi({
              routes: [[entityRouteRef, '/catalog/:namespace/:kind/:name']],
            }),
          ],
          [appHistoryApiRef, appHistory],
        ]}
      >
        <PageMountProvider mount={pageMount}>
          <MemoryRouter>
            <EntityRefLink entityRef={entity} />
          </MemoryRouter>
        </PageMountProvider>
      </TestApiProvider>,
    );

    const link = screen.getByText('software').closest('a');
    expect(link).toHaveAttribute('href', '/catalog/default/component/software');

    fireEvent.click(screen.getByText('software'));
    expect(navigate).toHaveBeenCalledWith(
      '/catalog/default/component/software',
    );
  });

  it('renders a basename-prefixed href and reports clicks to analytics', () => {
    const analyticsApi = mockApis.analytics();
    const appHistory = createMockAppHistory({ basename: '/backstage' });

    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'default',
      },
    };

    render(
      <TestApiProvider
        apis={[
          [
            routeResolutionApiRef,
            createMockRouteResolutionApi({
              routes: [[entityRouteRef, '/catalog/:namespace/:kind/:name']],
            }),
          ],
          [appHistoryApiRef, appHistory],
          [analyticsApiRef, analyticsApi],
        ]}
      >
        <MemoryRouter>
          <EntityRefLink entityRef={entity} noTrack={false} />
        </MemoryRouter>
      </TestApiProvider>,
    );

    const link = screen.getByText('software').closest('a');
    // Middle-click / "open in new tab" only ever see the href.
    expect(link).toHaveAttribute(
      'href',
      '/backstage/catalog/default/component/software',
    );
    // `noTrack` is a Link concern and must not reach the DOM.
    expect(link).not.toHaveAttribute('notrack');

    fireEvent.click(screen.getByText('software'));
    expect(analyticsApi.captureEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'click',
        subject: '/catalog/default/component/software',
        attributes: { to: '/catalog/default/component/software' },
      }),
    );
  });

  it('uses entityLink with framework navigate when route resolution returns undefined', () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'default',
      },
    };

    const { appHistory } = renderInFrontendTestApp(
      <EntityRefLink entityRef={entity} />,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
        apis: [[routeResolutionApiRef, { resolve: () => undefined }]],
      },
    );

    const navigateSpy = jest.spyOn(appHistory, 'navigate');

    const link = screen.getByText('software').closest('a');
    expect(link).toHaveAttribute('href', '/catalog/default/component/software');

    fireEvent.click(screen.getByText('software'));
    expect(navigateSpy).toHaveBeenCalledWith(
      '/catalog/default/component/software',
    );
  });

  it('does not framework-navigate for modified clicks or target=_blank', () => {
    const navigate = jest.fn();
    const appHistory = createMockAppHistory({ navigate });

    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'default',
      },
    };

    const { rerender } = render(
      <TestApiProvider
        apis={[
          [
            routeResolutionApiRef,
            createMockRouteResolutionApi({
              routes: [[entityRouteRef, '/catalog/:namespace/:kind/:name']],
            }),
          ],
          [appHistoryApiRef, appHistory],
        ]}
      >
        <MemoryRouter>
          <EntityRefLink entityRef={entity} target="_blank" />
        </MemoryRouter>
      </TestApiProvider>,
    );

    fireEvent.click(screen.getByText('software'));
    expect(navigate).not.toHaveBeenCalled();

    rerender(
      <TestApiProvider
        apis={[
          [
            routeResolutionApiRef,
            createMockRouteResolutionApi({
              routes: [[entityRouteRef, '/catalog/:namespace/:kind/:name']],
            }),
          ],
          [appHistoryApiRef, appHistory],
        ]}
      >
        <MemoryRouter>
          <EntityRefLink entityRef={entity} />
        </MemoryRouter>
      </TestApiProvider>,
    );

    fireEvent.click(screen.getByText('software'), { ctrlKey: true });
    expect(navigate).not.toHaveBeenCalled();
  });

  it('falls back to react-router Link when there is no app history (OFS)', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'default',
      },
    };

    await renderInTestApp(<EntityRefLink entityRef={entity} />, {
      mountedRoutes: {
        '/catalog/:namespace/:kind/:name/*': entityRouteRef,
      },
    });

    expect(screen.getByText('software').closest('a')).toHaveAttribute(
      'href',
      '/catalog/default/component/software',
    );
  });
});
