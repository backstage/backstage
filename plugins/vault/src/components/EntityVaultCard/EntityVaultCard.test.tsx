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

import React from 'react';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/test-utils';
import { ComponentEntity } from '@backstage/catalog-model';
import { render } from '@testing-library/react';
import { EntityVaultCard } from './EntityVaultCard';
import { EntityProvider } from '@backstage/plugin-catalog-react';

describe('EntityVaultCard', () => {
  const server = setupServer();
  setupRequestMockHandlers(server);
  const entityAnnotationMissing: ComponentEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'test',
      description: 'This is the description',
    },
    spec: {
      lifecycle: 'production',
      owner: 'owner',
      type: 'service',
    },
  };

  it('should render missing entity annotation', async () => {
    const rendered = render(
      <EntityProvider entity={entityAnnotationMissing}>
        <EntityVaultCard />
      </EntityProvider>,
    );
    expect(
      rendered.getByText(/Add the annotation to your component YAML/),
    ).toBeInTheDocument();
  });
});
