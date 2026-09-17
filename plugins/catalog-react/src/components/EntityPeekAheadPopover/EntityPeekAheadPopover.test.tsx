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

import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { EntityPeekAheadPopover } from './EntityPeekAheadPopover';
import { ApiProvider } from '@backstage/core-app-api';
import { TestApiRegistry, renderInTestApp } from '@backstage/test-utils';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { catalogApiRef } from '../../api';
import Button from '@material-ui/core/Button';
import { entityRouteRef } from '../../routes';

const catalogApi = catalogApiMock({
  entities: [
    {
      apiVersion: '',
      kind: 'Component',
      metadata: {
        namespace: 'default',
        name: 'service1',
      },
      spec: {
        tags: ['java'],
      },
    },
  ],
});

const apis = TestApiRegistry.from([catalogApiRef, catalogApi]);

describe('<EntityPeekAheadPopover/>', () => {
  it('renders all owners', async () => {
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityPeekAheadPopover entityRef="component:default/service1">
          <Button data-testid="popover1">s1</Button>
        </EntityPeekAheadPopover>
        <EntityPeekAheadPopover entityRef="component:default/service2">
          <Button data-testid="popover2">s2</Button>
        </EntityPeekAheadPopover>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(screen.getByText('s1')).toBeInTheDocument();
    expect(screen.queryByText('service1')).toBeNull();
    await user.hover(screen.getByTestId('popover1'));
    expect(await screen.findByText('service1')).toBeInTheDocument();

    expect(screen.getByText('s2')).toBeInTheDocument();
    expect(screen.queryByText('service2')).toBeNull();
    await user.hover(screen.getByTestId('popover2'));
    expect(
      await screen.findByText('Error: component:default/service2 not found'),
    ).toBeInTheDocument();
  });
});
