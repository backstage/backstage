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

import { ComponentEntity } from '@backstage/catalog-model';
import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { JsonPage } from './JsonPage';

describe('JsonPage', () => {
  it('renders', async () => {
    const entity: ComponentEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        namespace: 'default',
        name: 'c1',
      },
      spec: {
        type: 'service',
        lifecycle: 'production',
        owner: 'ops',
      },
    };

    await renderInTestApp(<JsonPage entity={entity} />);

    expect(screen.getByTestId('code-snippet')).toHaveTextContent(
      '"lifecycle": "production"',
    );
  });
});
