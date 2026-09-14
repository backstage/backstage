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
import { Link as ReactAriaLink } from 'react-aria-components';
import { MemoryRouter } from 'react-router-dom';
import { useMemo, type ComponentProps, type PropsWithChildren } from 'react';
import { useAnalytics } from '../analytics/useAnalytics';
import { fallbackRoutingIntegration } from '../navigation/useRouting';
import {
  BUIContext,
  type BUIContextVersions,
  type BUIContextValueV1,
} from './BUIContext';
import { BUIProvider } from './BUIProvider';

const mockFallbackNavigate = jest.fn();
const BUIContextV1 = createVersionedContext<{ 1: BUIContextValueV1 }>('bui');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockFallbackNavigate,
}));

describe('BUIProvider', () => {
  beforeEach(() => {
    mockFallbackNavigate.mockReset();
  });

  it('provides stable, self-contained context versions', () => {
    const captureEvent = jest.fn();
    const useProvidedAnalytics = () => ({ captureEvent });
    const wrapper = ({ children }: PropsWithChildren) => (
      <BUIProvider useAnalytics={useProvidedAnalytics}>{children}</BUIProvider>
    );
    const { result, rerender } = renderHook(
      () => ({
        context: useVersionedContext<BUIContextVersions>('bui'),
        analytics: useAnalytics(),
      }),
      { wrapper },
    );

    const firstRouting = result.current.context?.atVersion(2)?.routing;
    const firstCreateRouterOptions = firstRouting?.createRouterOptions;

    expect(result.current.context?.atVersion(1)).toEqual({
      useAnalytics: useProvidedAnalytics,
    });
    expect(result.current.context?.atVersion(2)).toEqual({
      useAnalytics: useProvidedAnalytics,
      routing: firstRouting,
    });
    result.current.analytics.captureEvent('click', 'Destination');
    expect(captureEvent).toHaveBeenCalledWith('click', 'Destination');

    const routerOptions = firstRouting?.createRouterOptions(jest.fn(), {
      replace: true,
    });
    const anotherRouterOptions = firstRouting?.createRouterOptions(jest.fn(), {
      replace: true,
    });

    expect(Object.keys(routerOptions ?? {})).toEqual(['replace']);
    expect(routerOptions).toEqual({ replace: true });
    expect(anotherRouterOptions).not.toBe(routerOptions);

    rerender();

    expect(result.current.context?.atVersion(2)?.routing).toBe(firstRouting);
    expect(
      result.current.context?.atVersion(2)?.routing.createRouterOptions,
    ).toBe(firstCreateRouterOptions);
  });

  it('prefers V2 analytics when both context versions are available', () => {
    const captureV1Event = jest.fn();
    const captureV2Event = jest.fn();
    const value = createVersionedValueMap({
      1: { useAnalytics: () => ({ captureEvent: captureV1Event }) },
      2: {
        useAnalytics: () => ({ captureEvent: captureV2Event }),
        routing: fallbackRoutingIntegration,
      },
    });
    const wrapper = ({ children }: PropsWithChildren) => (
      <BUIContext.Provider value={value}>{children}</BUIContext.Provider>
    );
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    result.current.captureEvent('click', 'Destination');

    expect(captureV2Event).toHaveBeenCalledWith('click', 'Destination');
    expect(captureV1Event).not.toHaveBeenCalled();
  });

  it('accepts analytics from a V1-only provider', () => {
    const captureV1Event = jest.fn();
    const value = createVersionedValueMap({
      1: { useAnalytics: () => ({ captureEvent: captureV1Event }) },
    });
    const wrapper = ({ children }: PropsWithChildren) => (
      <BUIContextV1.Provider value={value}>{children}</BUIContextV1.Provider>
    );
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    result.current.captureEvent('click', 'Legacy destination');
    expect(captureV1Event).toHaveBeenCalledWith('click', 'Legacy destination');
  });

  it('delegates React Aria navigation created by the component', () => {
    const componentNavigate = jest.fn();

    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BUIProvider>
          <DelegatedLink onNavigate={componentNavigate} />
        </BUIProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Destination' }));

    expect(componentNavigate).toHaveBeenCalledTimes(1);
    expect(mockFallbackNavigate).not.toHaveBeenCalled();
  });

  it('uses fallback navigation for unrecognized React Aria router options', () => {
    const linkProps: ComponentProps<typeof ReactAriaLink> = {
      href: '/destination',
      routerOptions: { replace: true },
    };

    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BUIProvider>
          <ReactAriaLink {...linkProps}>Destination</ReactAriaLink>
        </BUIProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Destination' }));

    expect(mockFallbackNavigate).toHaveBeenCalledWith('/destination', {
      replace: true,
    });
  });
});

function DelegatedLink(props: { onNavigate: () => void }) {
  const routing =
    useVersionedContext<BUIContextVersions>('bui')?.atVersion(2)?.routing;
  const routerOptions = useMemo(() => {
    if (!routing) {
      throw new Error('Expected BUI routing integration');
    }
    return routing.createRouterOptions(props.onNavigate, { replace: true });
  }, [props.onNavigate, routing]);

  return (
    <ReactAriaLink href="/destination" routerOptions={routerOptions}>
      Destination
    </ReactAriaLink>
  );
}
