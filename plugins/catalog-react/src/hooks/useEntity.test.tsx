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

import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import {
  useEntity,
  EntityProvider,
  AsyncEntityProvider,
  EntityContext,
} from './useEntity';
import { Entity } from '@backstage/catalog-model';

describe('EntityProvider', () => {
  it('should provide no entity', async () => {
    const { result } = renderHook(() => useEntity(), {
      wrapper: ({ children }) => <EntityProvider children={children} />,
    });

    expect(result.current.entity).toBe(undefined);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(undefined);
    expect(result.current.refresh).toBe(undefined);
  });

  it('should provide an entity', async () => {
    const entity = { kind: 'MyEntity' } as Entity;
    const { result } = renderHook(() => useEntity(), {
      wrapper: ({ children }) => (
        <EntityProvider entity={entity} children={children} />
      ),
    });

    expect(result.current.entity).toBe(entity);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(undefined);
    expect(result.current.refresh).toBe(undefined);
  });
});

describe('AsyncEntityProvider', () => {
  it('should provide no entity', async () => {
    const { result } = renderHook(() => useEntity(), {
      wrapper: ({ children }) => (
        <AsyncEntityProvider loading={false} children={children} />
      ),
    });

    expect(result.current.entity).toBe(undefined);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(undefined);
    expect(result.current.refresh).toBe(undefined);
  });

  it('should provide an entity', async () => {
    const entity = { kind: 'MyEntity' } as Entity;
    const refresh = () => {};
    const { result } = renderHook(() => useEntity(), {
      wrapper: ({ children }) => (
        <AsyncEntityProvider
          loading={false}
          entity={entity}
          refresh={refresh}
          children={children}
        />
      ),
    });

    expect(result.current.entity).toBe(entity);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(undefined);
    expect(result.current.refresh).toBe(refresh);
  });

  it('should provide an error', async () => {
    const error = new Error('oh no');
    const { result } = renderHook(() => useEntity(), {
      wrapper: ({ children }) => (
        <AsyncEntityProvider
          loading={false}
          error={error}
          children={children}
        />
      ),
    });

    expect(result.current.entity).toBe(undefined);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.refresh).toBe(undefined);
  });
});

describe('EntityContext.Provider', () => {
  it('should provide no entity', async () => {
    const { result } = renderHook(() => useEntity(), {
      wrapper: ({ children }) => (
        <EntityContext.Provider
          value={{ loading: false }}
          children={children}
        />
      ),
    });

    expect(result.current.entity).toBe(undefined);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(undefined);
    expect(result.current.refresh).toBe(undefined);
  });

  it('should provide an entity', async () => {
    const entity = { kind: 'MyEntity' } as Entity;
    const { result } = renderHook(() => useEntity(), {
      wrapper: ({ children }) => (
        <EntityContext.Provider
          value={{ entity, loading: false }}
          children={children}
        />
      ),
    });

    expect(result.current.entity).toBe(entity);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(undefined);
    expect(result.current.refresh).toBe(undefined);
  });
});
