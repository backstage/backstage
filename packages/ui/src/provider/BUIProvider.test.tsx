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

import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import {
  createVersionedContext,
  createVersionedValueMap,
  useVersionedContext,
} from '@backstage/version-bridge';
import { Link } from 'react-aria-components';
import type { PropsWithChildren } from 'react';
import { useAnalytics } from '../analytics/useAnalytics';
import { BUIRoutingProvider } from '../navigation/BUIRoutingProvider';
import { type BUIContextVersions, type BUIContextValueV1 } from './BUIContext';
import { BUIProvider } from './BUIProvider';
import type { BUIRouter } from './BUIRouter';

describe('BUIProvider', () => {
  it('publishes stable analytics and explicit host capabilities', () => {
    const captureEvent = jest.fn();
    const useProvidedAnalytics = () => ({ captureEvent });
    const useProvidedRouter = (): BUIRouter => ({
      navigate: jest.fn(),
      resolveHref: href => href,
      pathname: '/',
    });
    const wrapper = ({ children }: PropsWithChildren) => (
      <BUIProvider
        useAnalytics={useProvidedAnalytics}
        useRouter={useProvidedRouter}
      >
        {children}
      </BUIProvider>
    );
    const { result, rerender } = renderHook(
      () => ({
        context: useVersionedContext<BUIContextVersions>('bui'),
        analytics: useAnalytics(),
      }),
      { wrapper },
    );

    expect(result.current.context?.atVersion(1)).toEqual({
      useAnalytics: useProvidedAnalytics,
    });
    expect(result.current.context?.atVersion(2)).toBeUndefined();
    expect(result.current.context?.atVersion(3)).toEqual({
      useAnalytics: useProvidedAnalytics,
      useRouter: useProvidedRouter,
    });
    result.current.analytics.captureEvent('click', 'Destination');
    expect(captureEvent).toHaveBeenCalledWith('click', 'Destination');
    const firstContext = result.current.context;
    rerender();
    expect(result.current.context).toBe(firstContext);
  });

  it('inherits the host through nested providers', () => {
    const navigate = jest.fn();
    render(
      <BUIProvider
        useRouter={() => ({
          navigate,
          resolveHref: href => `/base${href}`,
          pathname: '/base',
        })}
      >
        <BUIProvider>
          <BUIRoutingProvider>
            <Link href="/catalog">Catalog</Link>
          </BUIRoutingProvider>
        </BUIProvider>
      </BUIProvider>,
    );
    const link = screen.getByRole('link', { name: 'Catalog' });
    expect(link).toHaveAttribute('href', '/base/catalog');
    fireEvent.click(link);
    expect(navigate).toHaveBeenCalledWith('/catalog', undefined);
  });

  it('reads analytics from older providers without requiring their routing capabilities', () => {
    const LegacyContext = createVersionedContext<{
      1: BUIContextValueV1;
      2: BUIContextValueV1;
    }>('bui');
    const captureV1Event = jest.fn();
    const captureV2Event = jest.fn();
    const value = createVersionedValueMap({
      1: { useAnalytics: () => ({ captureEvent: captureV1Event }) },
      2: { useAnalytics: () => ({ captureEvent: captureV2Event }) },
    });
    const wrapper = ({ children }: PropsWithChildren) => (
      <LegacyContext.Provider value={value}>{children}</LegacyContext.Provider>
    );
    const { result } = renderHook(() => useAnalytics(), { wrapper });
    result.current.captureEvent('click', 'Destination');
    expect(captureV2Event).toHaveBeenCalledWith('click', 'Destination');
    expect(captureV1Event).not.toHaveBeenCalled();
  });

  it('reads analytics from a V1-only provider', () => {
    const LegacyContext = createVersionedContext<{ 1: BUIContextValueV1 }>(
      'bui',
    );
    const captureEvent = jest.fn();
    const value = createVersionedValueMap({
      1: { useAnalytics: () => ({ captureEvent }) },
    });
    const wrapper = ({ children }: PropsWithChildren) => (
      <LegacyContext.Provider value={value}>{children}</LegacyContext.Provider>
    );
    const { result } = renderHook(() => useAnalytics(), { wrapper });
    result.current.captureEvent('click', 'Destination');
    expect(captureEvent).toHaveBeenCalledWith('click', 'Destination');
  });
});
