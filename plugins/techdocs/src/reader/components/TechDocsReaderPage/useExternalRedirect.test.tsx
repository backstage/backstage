/*
 * Copyright 2025 The Backstage Authors
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

import { renderHook, waitFor } from '@testing-library/react';
import { useExternalRedirect } from './useExternalRedirect';
import { TestApiProvider } from '@backstage/test-utils';
import {
  appHistoryApiRef,
  routeResolutionApiRef,
} from '@backstage/frontend-plugin-api';
import {
  createMockAppHistory,
  createMockRouteResolutionApi,
} from '@backstage/frontend-test-utils';
import { rootDocsRouteRef } from '../../../routes';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { TECHDOCS_EXTERNAL_ANNOTATION } from '@backstage/plugin-techdocs-common';

const mockNavigate = jest.fn();
describe('useExternalRedirect', () => {
  const mockCatalogApi = {
    getEntityByRef: jest.fn(),
  };

  let appHistory: ReturnType<typeof createMockAppHistory>;
  const routes = createMockRouteResolutionApi({
    routes: [[rootDocsRouteRef, '/docs/:namespace/:kind/:name']],
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestApiProvider
      apis={[
        [catalogApiRef, mockCatalogApi],
        [appHistoryApiRef, appHistory],
        [routeResolutionApiRef, routes],
      ]}
    >
      {children}
    </TestApiProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    appHistory = createMockAppHistory({ navigate: mockNavigate });
  });

  it('should not show progress when entity has no external annotation', async () => {
    mockCatalogApi.getEntityByRef.mockResolvedValue({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'test-component',
        namespace: 'default',
      },
    });

    const { result } = renderHook(
      () =>
        useExternalRedirect({
          kind: 'Component',
          name: 'test-component',
          namespace: 'default',
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.shouldShowProgress).toBe(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should navigate when entity has external annotation', async () => {
    mockCatalogApi.getEntityByRef.mockResolvedValue({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'test-component',
        namespace: 'default',
        annotations: {
          [TECHDOCS_EXTERNAL_ANNOTATION]: 'component:external/docs',
        },
      },
    });

    const { result } = renderHook(
      () =>
        useExternalRedirect({
          kind: 'Component',
          name: 'test-component',
          namespace: 'default',
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.shouldShowProgress).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith('/docs/external/component/docs', {
      replace: true,
    });
  });

  it('should handle catalog API errors gracefully', async () => {
    mockCatalogApi.getEntityByRef.mockRejectedValue(
      new Error('Catalog API error'),
    );

    const { result } = renderHook(
      () =>
        useExternalRedirect({
          kind: 'Component',
          name: 'test-component',
          namespace: 'default',
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.shouldShowProgress).toBe(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should not re-check when entity key stays the same', async () => {
    mockCatalogApi.getEntityByRef.mockResolvedValue({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'test-component',
        namespace: 'default',
      },
    });

    const { rerender } = renderHook(
      () =>
        useExternalRedirect({
          kind: 'Component',
          name: 'test-component',
          namespace: 'default',
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(mockCatalogApi.getEntityByRef).toHaveBeenCalledTimes(1);
    });

    // Rerender with the same entity - should not trigger another API call
    rerender();

    expect(mockCatalogApi.getEntityByRef).toHaveBeenCalledTimes(1);
  });

  it('should handle deep linking with techdocs-entity-path annotation', async () => {
    mockCatalogApi.getEntityByRef.mockResolvedValue({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'test-component',
        namespace: 'default',
        annotations: {
          'backstage.io/techdocs-entity': 'component:external/docs',
          'backstage.io/techdocs-entity-path': '/inner-component-docs',
        },
      },
    });

    const { result } = renderHook(
      () =>
        useExternalRedirect({
          kind: 'Component',
          name: 'test-component',
          namespace: 'default',
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Preserve the document path from the target entity annotation.
    expect(mockNavigate).toHaveBeenCalledWith(
      '/docs/external/component/docs/inner-component-docs',
      {
        replace: true,
      },
    );
    expect(result.current.shouldShowProgress).toBe(true);
  });

  it('should handle empty external annotation value', async () => {
    mockCatalogApi.getEntityByRef.mockResolvedValue({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'test-component',
        namespace: 'default',
        annotations: {
          'backstage.io/techdocs-entity': '',
        },
      },
    });

    const { result } = renderHook(
      () =>
        useExternalRedirect({
          kind: 'Component',
          name: 'test-component',
          namespace: 'default',
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Empty annotation should be treated as no redirect
    expect(result.current.shouldShowProgress).toBe(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should re-check when entity changes', async () => {
    mockCatalogApi.getEntityByRef
      .mockResolvedValueOnce({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'first-component',
          namespace: 'default',
        },
      })
      .mockResolvedValueOnce({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'second-component',
          namespace: 'default',
        },
      });

    const { rerender } = renderHook(
      ({ entityRef }) => useExternalRedirect(entityRef),
      {
        wrapper,
        initialProps: {
          entityRef: {
            kind: 'Component',
            name: 'first-component',
            namespace: 'default',
          },
        },
      },
    );

    await waitFor(() => {
      expect(mockCatalogApi.getEntityByRef).toHaveBeenCalledTimes(1);
    });

    // Change to a different entity
    rerender({
      entityRef: {
        kind: 'Component',
        name: 'second-component',
        namespace: 'default',
      },
    });

    await waitFor(() => {
      expect(mockCatalogApi.getEntityByRef).toHaveBeenCalledTimes(2);
    });
  });
});
