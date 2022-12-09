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

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { EntityPeekAheadPopover } from './EntityPeekAheadPopover';
import { ApiProvider } from '@backstage/core-app-api';
import { TestApiRegistry } from '@backstage/test-utils';
import { catalogApiRef } from '../../api';
import { CompoundEntityRef, Entity } from '@backstage/catalog-model';
import { CatalogApi } from '@backstage/catalog-client';

const catalogApi: Partial<CatalogApi> = {
  getEntityByRef: async (
    entityRef: CompoundEntityRef,
  ): Promise<Entity | undefined> => {
    if (
      entityRef ===
      { name: 'service1', namespace: 'default', kind: 'component ' }
    ) {
      return {
        apiVersion: '',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'service1',
        },
        spec: {
          tags: ['java'],
        },
      };
    }
    return undefined;
  },
};

const apis = TestApiRegistry.from([catalogApiRef, catalogApi]);

describe('<EntityPeekAheadPopover/>', () => {
  it('renders all owners', async () => {
    render(
      <ApiProvider apis={apis}>
        <EntityPeekAheadPopover
          entityRef={{
            name: 'service1',
            namespace: 'default',
            kind: 'component',
          }}
        >
          <div data-testid="popover">asdf</div>
        </EntityPeekAheadPopover>
      </ApiProvider>,
    );
    expect(screen.getByText('asdf')).toBeInTheDocument();
    expect(screen.queryByText('service1')).toBeNull();
    fireEvent.mouseOver(screen.getByTestId('popover'));
    expect(screen.getByText('service1')).toBeInTheDocument();
  });
});
