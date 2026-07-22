/*
 * Copyright 2026 The Backstage Authors
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
import { renderHook } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import useAsyncRetry from 'react-use/esm/useAsyncRetry';
import {
  errorApiRef,
  useApi,
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useGoldenPathFromUrl } from './useGoldenPathFromUrl';
import { waitFor } from '@testing-library/react';
import {
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('react-use/esm/useAsyncRetry', () => jest.fn());

jest.mock('@backstage/core-plugin-api', () => ({
  errorApiRef: {},
  useApi: jest.fn(),
  useRouteRefParams: jest.fn(),
}));

jest.mock('@backstage/plugin-catalog-react', () => ({
  catalogApiRef: {},
  entityRouteRef: {},
}));

describe('useGoldenPathFromUrl', () => {
  const mockNavigate = jest.fn();
  const mockErrorApi = { post: jest.fn() };
  const mockCatalogApi = { getEntityByRef: jest.fn() };

  beforeEach(() => {
    jest.resetAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useApi as jest.Mock).mockImplementation(ref => {
      if (ref === errorApiRef) return mockErrorApi;
      if (ref === catalogApiRef) return mockCatalogApi;
      return null;
    });
    (useRouteRefParams as jest.Mock).mockReturnValue({
      namespace: 'default',
      name: 'test-name',
    });
    (useAsyncRetry as jest.Mock).mockImplementation(fn => {
      const execute = async () => fn();

      void execute();
      return {
        value: null,
        error: null,
        loading: false,
        retry: jest.fn(execute),
        execute,
      };
    });
  });

  it('should return entity, loading, error, and refresh', () => {
    const { result } = renderHook(() => useGoldenPathFromUrl());
    expect(result.current).toMatchObject({
      entity: null,
      loading: false,
      error: null,
      refresh: expect.any(Function),
    });
  });

  it('should call errorApi.post and navigate if name is not provided', () => {
    (useRouteRefParams as jest.Mock).mockReturnValue({
      namespace: 'default',
      name: '',
    });
    renderHook(() => useGoldenPathFromUrl());
    expect(mockErrorApi.post).toHaveBeenCalledWith(
      new Error('No name provided!'),
    );
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should call catalogApi.getEntityByRef with correct parameters', async () => {
    renderHook(() => useGoldenPathFromUrl());

    const expectedRef = stringifyEntityRef({
      kind: 'GoldenPath',
      namespace: 'default',
      name: 'test-name',
    });

    await waitFor(() => {
      expect(mockCatalogApi.getEntityByRef).toHaveBeenCalledWith(expectedRef);
    });
  });

  it('uses opts.name over route params when provided', async () => {
    (useRouteRefParams as jest.Mock).mockReturnValue({
      namespace: 'default',
      name: 'route-name',
    });

    renderHook(() => useGoldenPathFromUrl({ name: 'opts-name' }));

    const expectedRef = stringifyEntityRef({
      kind: 'GoldenPath',
      namespace: 'default',
      name: 'opts-name',
    });

    await waitFor(() => {
      expect(mockCatalogApi.getEntityByRef).toHaveBeenCalledWith(expectedRef);
    });
  });

  it('uses opts.namespace over route params and lowercases it', async () => {
    (useRouteRefParams as jest.Mock).mockReturnValue({
      namespace: 'ROUTE-NS',
      name: 'route-name',
    });

    renderHook(() => useGoldenPathFromUrl({ namespace: 'MiXeDCaseNS' }));

    const expectedRef = stringifyEntityRef({
      kind: 'GoldenPath',
      namespace: 'mixedcasens',
      name: 'route-name',
    });

    await waitFor(() => {
      expect(mockCatalogApi.getEntityByRef).toHaveBeenCalledWith(expectedRef);
    });
  });

  it('falls back to route namespace (lowercased) when opts.namespace is undefined', async () => {
    (useRouteRefParams as jest.Mock).mockReturnValue({
      namespace: 'DeFaUlT',
      name: 'route-name',
    });

    renderHook(() => useGoldenPathFromUrl({ name: 'chosen-name' }));

    const expectedRef = stringifyEntityRef({
      kind: 'GoldenPath',
      namespace: 'default',
      name: 'chosen-name',
    });

    await waitFor(() => {
      expect(mockCatalogApi.getEntityByRef).toHaveBeenCalledWith(expectedRef);
    });
  });

  it('falls back to DEFAULT_NAMESPACE when both route and opts namespaces are undefined', async () => {
    (useRouteRefParams as jest.Mock).mockReturnValue({
      name: 'route-name',
    });

    renderHook(() => useGoldenPathFromUrl());

    const expectedRef = stringifyEntityRef({
      kind: 'GoldenPath',
      namespace: DEFAULT_NAMESPACE,
      name: 'route-name',
    });

    await waitFor(() => {
      expect(mockCatalogApi.getEntityByRef).toHaveBeenCalledWith(expectedRef);
    });
  });

  it("treats empty opts.name ('') as invalid, posts error, and does not call catalogApi", async () => {
    (useRouteRefParams as jest.Mock).mockReturnValue({
      namespace: 'default',
      name: 'route-name',
    });

    renderHook(() => useGoldenPathFromUrl({ name: '' }));

    await waitFor(() => {
      expect(mockErrorApi.post).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'No name provided!' }),
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it("respects empty opts.namespace ('') over route/default (even though empty) and lowercases it", async () => {
    (useRouteRefParams as jest.Mock).mockReturnValue({
      namespace: 'route-ns',
      name: 'route-name',
    });

    renderHook(() => useGoldenPathFromUrl({ namespace: '' }));

    const expectedRef = stringifyEntityRef({
      kind: 'GoldenPath',
      namespace: '',
      name: 'route-name',
    });

    await waitFor(() => {
      expect(mockCatalogApi.getEntityByRef).toHaveBeenCalledWith(expectedRef);
    });
  });
});
