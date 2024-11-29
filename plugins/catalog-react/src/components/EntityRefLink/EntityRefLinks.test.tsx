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

import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { entityRouteRef } from '../../routes';
import { EntityRefLinks } from './EntityRefLinks';

describe('<EntityRefLinks />', () => {
  it('renders a single link', async () => {
    const entityNames = [
      {
        kind: 'Component',
        namespace: 'default',
        name: 'software',
      },
    ];
    await renderInTestApp(<EntityRefLinks entityRefs={entityNames} />, {
      mountedRoutes: {
        '/catalog/:namespace/:kind/:name/*': entityRouteRef,
      },
    });
    expect(screen.getByText('software').closest('a')).toHaveAttribute(
      'href',
      '/catalog/default/component/software',
    );
  });

  it('renders multiple links', async () => {
    const entityNames = [
      {
        kind: 'Component',
        namespace: 'default',
        name: 'software',
      },
      {
        kind: 'API',
        namespace: 'default',
        name: 'interface',
      },
    ];
    await renderInTestApp(<EntityRefLinks entityRefs={entityNames} />, {
      mountedRoutes: {
        '/catalog/:namespace/:kind/:name/*': entityRouteRef,
      },
    });
    expect(screen.getByText(',')).toBeInTheDocument();
    expect(screen.getByText('software').closest('a')).toHaveAttribute(
      'href',
      '/catalog/default/component/software',
    );
    expect(screen.getByText('interface').closest('a')).toHaveAttribute(
      'href',
      '/catalog/default/api/interface',
    );
  });
});
