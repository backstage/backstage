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

import { TooltipProvider } from '@backstage/core-components';
import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
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
    await renderInTestApp(
      <TooltipProvider>
        <EntityRefLink entityRef={entity} />
      </TooltipProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );
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
    await renderInTestApp(
      <TooltipProvider>
        <EntityRefLink entityRef={entity} />
      </TooltipProvider>,
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
      <TooltipProvider>
        <EntityRefLink entityRef={entity} defaultKind="Component" />
      </TooltipProvider>,
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
    await renderInTestApp(
      <TooltipProvider>
        <EntityRefLink entityRef={entityName} />
      </TooltipProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );
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
    await renderInTestApp(
      <TooltipProvider>
        <EntityRefLink entityRef={entityName} />
      </TooltipProvider>,
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

  it('renders link for entity name and hides default kind', async () => {
    const entityName = {
      kind: 'Component',
      namespace: 'test',
      name: 'software',
    };
    await renderInTestApp(
      <TooltipProvider>
        <EntityRefLink entityRef={entityName} defaultKind="component" />
      </TooltipProvider>,
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
      <TooltipProvider>
        <EntityRefLink entityRef={entityName} defaultKind="component">
          Custom Children
        </EntityRefLink>
      </TooltipProvider>,
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
      <TooltipProvider>
        <EntityRefLink entityRef={entityName} defaultKind="component">
          Custom Children
        </EntityRefLink>
      </TooltipProvider>,
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
});
