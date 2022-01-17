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

import React, { PropsWithChildren } from 'react';
import { catalogEntityDeletePermission } from '@backstage/plugin-catalog-common';
import { renderHook } from '@testing-library/react-hooks';
import { useEntityPermission } from './useEntityPermission';
import { MockPermissionApi, TestApiProvider } from '@backstage/test-utils';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from './useEntity';

const mockPermissionApi = new MockPermissionApi();

function createWrapper(entity?: Entity) {
  return ({ children }: PropsWithChildren<{}>) => (
    <TestApiProvider apis={[[permissionApiRef, mockPermissionApi]]}>
      <EntityProvider entity={entity} children={children} />
    </TestApiProvider>
  );
}

describe('useEntityPermission', () => {
  it('returns authorization result', async () => {
    const { result, waitForValueToChange } = renderHook(
      () => useEntityPermission(catalogEntityDeletePermission),
      {
        wrapper: createWrapper({
          apiVersion: 'a',
          kind: 'b',
          metadata: { name: 'c' },
        }),
      },
    );

    await waitForValueToChange(() => result.current);

    expect(result.current.allowed).toBe(true);
  });

  it('throws error if no entity is found', async () => {
    const { waitForNextUpdate } = renderHook(
      () => useEntityPermission(catalogEntityDeletePermission),
      {
        wrapper: createWrapper(),
      },
    );

    await expect(() => waitForNextUpdate()).rejects.toThrowError();
  });
});
