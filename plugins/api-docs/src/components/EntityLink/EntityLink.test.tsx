/*
 * Copyright 2020 Spotify AB
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

import { Entity } from '@backstage/catalog-model';
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { EntityLink } from './EntityLink';

describe('<EntityLink />', () => {
  it('provides link to entity page', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'my-name',
        namespace: 'my-namespace',
      },
    };
    const { getByText } = await renderInTestApp(
      <EntityLink entity={entity}>inner</EntityLink>,
    );
    expect(getByText(/inner/i)).toBeInTheDocument();
    expect(getByText(/inner/i)).toHaveAttribute(
      'href',
      '/catalog/my-namespace/component/my-name',
    );
  });
});
