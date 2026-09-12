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

import {
  createVersionedValueMap,
  type VersionedValue,
} from '@backstage/version-bridge';
import { fireEvent, render, screen } from '@testing-library/react';
import { useMemo, type PropsWithChildren } from 'react';
import { RouterProvider } from 'react-aria-components';
import {
  Link as RouterLink,
  MemoryRouter,
  Route,
  Routes,
  useHref,
  useInRouterContext,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';
import type { BUIRoutingIntegration } from '../../navigation/types';
import { useResolvedHref } from '../../hooks/useResolvedHref';
import { BUIContext, type BUIContextVersions } from '../../provider/BUIContext';
import { BUIProvider } from '../../provider/BUIProvider';
import { Button } from '../Button';
import {
  Menu,
  MenuItem,
  MenuListBox,
  MenuListBoxItem,
  MenuTrigger,
} from './Menu';

function LocationStatus() {
  return <span role="status">{useLocation().pathname}</span>;
}

describe('Menu links', () => {
  it('renders MenuItem with the host basename and navigates client-side', async () => {
    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BUIProvider>
          <MenuTrigger defaultOpen>
            <Button>Open</Button>
            <Menu>
              <MenuItem href="/catalog/docs">TechDocs</MenuItem>
            </Menu>
          </MenuTrigger>
          <LocationStatus />
        </BUIProvider>
      </MemoryRouter>,
    );

    const item = await screen.findByRole('menuitem', { name: 'TechDocs' });
    expect(item).toHaveAttribute('href', '/app/catalog/docs');
    fireEvent.click(item);
    expect(screen.getByRole('status')).toHaveTextContent('/catalog/docs');
  });

  it('reports a relative raw href through V1 analytics', async () => {
    const captureEvent = jest.fn();
    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog/entity/docs']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <V1AnalyticsProvider captureEvent={captureEvent}>
          <Routes>
            <Route
              path="catalog/entity/docs/*"
              element={
                <MenuTrigger defaultOpen>
                  <Button>Open</Button>
                  <Menu>
                    <MenuItem href="child">Child</MenuItem>
                  </Menu>
                </MenuTrigger>
              }
            />
          </Routes>
          <LocationStatus />
        </V1AnalyticsProvider>
      </MemoryRouter>,
    );

    const item = await screen.findByRole('menuitem', { name: 'Child' });
    expect(item).toHaveAttribute('href', '/app/catalog/entity/docs/child');
    fireEvent.click(item);
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/docs/child',
    );
    expect(captureEvent).toHaveBeenCalledWith('click', 'Child', {
      attributes: { to: 'child' },
    });
  });

  it('passes MenuItem the exact options registered by the component', async () => {
    const navigate = jest.fn();
    const register = jest.fn();
    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <TrackingProvider navigate={navigate} register={register}>
          <MenuTrigger defaultOpen>
            <Button>Open</Button>
            <Menu>
              <MenuItem href="/catalog/docs" routerOptions={{ replace: true }}>
                TechDocs
              </MenuItem>
            </Menu>
          </MenuTrigger>
        </TrackingProvider>
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByRole('menuitem', { name: 'TechDocs' }));
    const registeredOptions = register.mock.calls[0]?.[0];
    expect(registeredOptions).toBeDefined();
    expect(navigate).toHaveBeenCalledWith('/catalog/docs', registeredOptions);
  });

  it('wires MenuListBoxItem href into host navigation', async () => {
    const navigate = jest.fn();
    const register = jest.fn();
    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <TrackingProvider navigate={navigate} register={register}>
          <MenuTrigger defaultOpen>
            <Button>Open</Button>
            <MenuListBox aria-label="Destinations">
              <MenuListBoxItem
                id="docs"
                href="/catalog/docs"
                routerOptions={{ replace: true }}
              >
                TechDocs
              </MenuListBoxItem>
            </MenuListBox>
          </MenuTrigger>
        </TrackingProvider>
      </MemoryRouter>,
    );

    const item = await screen.findByRole('option', { name: 'TechDocs' });
    expect(item).toHaveAttribute('href', '/app/catalog/docs');
    fireEvent.click(item);
    const registeredOptions = register.mock.calls[0]?.[0];
    expect(registeredOptions).toBeDefined();
    expect(navigate).toHaveBeenCalledWith('/catalog/docs', registeredOptions);
  });

  it('retains the external target and rel defaults', async () => {
    render(
      <MenuTrigger defaultOpen>
        <Button>Open</Button>
        <Menu>
          <MenuItem href="https://example.test/docs">External docs</MenuItem>
        </Menu>
      </MenuTrigger>,
    );

    expect(
      await screen.findByRole('menuitem', { name: 'External docs' }),
    ).toHaveAttribute('target', '_blank');
    expect(
      screen.getByRole('menuitem', { name: 'External docs' }),
    ).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

function V1AnalyticsProvider({
  children,
  captureEvent,
}: PropsWithChildren<{ captureEvent: jest.Mock }>) {
  const navigate = useNavigate();
  const value = useMemo(
    () =>
      createVersionedValueMap({
        1: { useAnalytics: () => ({ captureEvent }) },
      }) as unknown as VersionedValue<BUIContextVersions>,
    [captureEvent],
  );

  return (
    <RouterProvider navigate={navigate} useHref={useResolvedHref}>
      <BUIContext.Provider value={value}>{children}</BUIContext.Provider>
    </RouterProvider>
  );
}

function TrackingProvider({
  children,
  navigate,
  register,
}: PropsWithChildren<{
  navigate: jest.Mock;
  register: jest.Mock;
}>) {
  const routing = useMemo<BUIRoutingIntegration>(
    () => ({
      Link: RouterLink,
      useHref,
      useInRouterContext,
      useLocation,
      useNavigate,
      useResolvedPath,
      createRouterOptions(_action, options) {
        const registered = { ...options };
        register(registered);
        return registered;
      },
    }),
    [register],
  );
  const value = useMemo(
    () => createVersionedValueMap({ 1: {}, 2: { routing } }),
    [routing],
  );

  return (
    <RouterProvider navigate={navigate} useHref={useResolvedHref}>
      <BUIContext.Provider value={value}>{children}</BUIContext.Provider>
    </RouterProvider>
  );
}
