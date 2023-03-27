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

import { catalogEntityDeletePermission } from '@backstage/plugin-catalog-common/alpha';
import { renderHook } from '@testing-library/react-hooks';
import { useEntityPermission } from './useEntityPermission';
import { useAsyncEntity } from './useEntity';
import { usePermission } from '@backstage/plugin-permission-react';

jest.mock('./useEntity', () => ({
  ...jest.requireActual('./useEntity'),
  useAsyncEntity: jest.fn(),
}));
jest.mock('@backstage/plugin-permission-react', () => ({
  ...jest.requireActual('@backstage/plugin-permission-react'),
  usePermission: jest.fn(),
}));
const useEntityMock = useAsyncEntity as jest.Mock;
const usePermissionMock = usePermission as jest.Mock;

describe('useEntityPermission', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns loading when entity is loading', () => {
    useEntityMock.mockReturnValue({ loading: true, entity: undefined });
    usePermissionMock.mockReturnValue({ loading: false, allowed: false });
    const { result } = renderHook(() =>
      useEntityPermission(catalogEntityDeletePermission),
    );

    expect(result.current.loading).toBe(true);
  });

  it('returns loading when permission is loading', () => {
    useEntityMock.mockReturnValue({
      loading: false,
      entity: {
        apiVersion: 'a',
        kind: 'b',
        metadata: { name: 'c' },
      },
    });
    usePermissionMock.mockReturnValue({ loading: true, allowed: false });
    const { result } = renderHook(() =>
      useEntityPermission(catalogEntityDeletePermission),
    );

    expect(result.current.loading).toBe(true);
  });

  it('does not authorize when there is an entity error', () => {
    useEntityMock.mockReturnValue({
      loading: false,
      entity: undefined,
      error: new Error(),
    });
    usePermissionMock.mockReturnValue({ loading: false, allowed: false });
    const { result } = renderHook(() =>
      useEntityPermission(catalogEntityDeletePermission),
    );

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.allowed).toBe(false);
  });

  it('returns authorization result', () => {
    useEntityMock.mockReturnValue({
      loading: false,
      entity: {
        apiVersion: 'a',
        kind: 'b',
        metadata: { name: 'c' },
      },
    });
    usePermissionMock.mockReturnValue({ loading: false, allowed: true });
    const { result } = renderHook(() =>
      useEntityPermission(catalogEntityDeletePermission),
    );

    expect(result.current.allowed).toBe(true);
  });
});
