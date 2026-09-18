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

import { createVersionedValueMap } from '@backstage/version-bridge';
import { fireEvent, render, screen } from '@testing-library/react';
import { useMemo, type PropsWithChildren } from 'react';
import { RouterProvider } from 'react-aria-components';
import {
  Link as RouterLink,
  MemoryRouter,
  useHref,
  useInRouterContext,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';
import type { BUIRoutingIntegration } from '../../navigation/types';
import { useResolvedHref } from '../../hooks/useResolvedHref';
import { BUIContext } from '../../provider/BUIContext';
import {
  SearchAutocomplete,
  SearchAutocompleteItem,
} from './SearchAutocomplete';

describe('SearchAutocompleteItem links', () => {
  it('renders the host basename and delegates client-side navigation', async () => {
    const navigate = jest.fn();
    const register = jest.fn();
    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <TrackingProvider navigate={navigate} register={register}>
          <SearchAutocomplete aria-label="Search" defaultOpen inputValue="doc">
            <SearchAutocompleteItem
              id="docs"
              textValue="TechDocs"
              href="/catalog/docs"
              routerOptions={{ replace: true }}
            >
              TechDocs
            </SearchAutocompleteItem>
          </SearchAutocomplete>
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

  it('renders native links with their browser-owned href', async () => {
    render(
      <SearchAutocomplete aria-label="Search" defaultOpen inputValue="doc">
        <SearchAutocompleteItem
          id="external"
          textValue="External docs"
          href="https://example.test/docs"
        >
          External docs
        </SearchAutocompleteItem>
      </SearchAutocomplete>,
    );

    expect(
      await screen.findByRole('option', { name: 'External docs' }),
    ).toHaveAttribute('href', 'https://example.test/docs');
  });
});

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
