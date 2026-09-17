/*
 * Copyright 2022 The Backstage Authors
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

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { OwnerEntityColumn } from './OwnerEntityColumn';

describe('<OwnerEntityColumn />', () => {
  it('should render a link to the user entity', async () => {
    const { getByRole } = await renderInTestApp(
      <TestApiProvider apis={[]}>
        <OwnerEntityColumn entityRef="user:default/foo" />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(getByRole('link')).toHaveAttribute(
      'href',
      '/catalog/default/user/foo',
    );
  });

  it('should render Unknown when entityRef is missing', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[]}>
        <OwnerEntityColumn />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(getByText('Unknown')).toBeInTheDocument();
  });
});
