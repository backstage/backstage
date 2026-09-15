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
import {
  forwardRef,
  useMemo,
  type ComponentProps,
  type PropsWithChildren,
} from 'react';
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
import { useResolvedHref } from '../../hooks/useResolvedHref';
import { BUIContext } from '../../provider/BUIContext';
import { BUIProvider } from '../../provider/BUIProvider';
import type { BUIRoutingIntegration } from '../../navigation/types';
import { ButtonLink } from './ButtonLink';

function LocationStatus() {
  return <span role="status">{useLocation().pathname}</span>;
}

describe('ButtonLink', () => {
  it('renders a disabled destination as a non-link element', () => {
    render(
      <MemoryRouter
        initialEntries={['/catalog']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BUIProvider>
          <ButtonLink href="/catalog/overview" isDisabled>
            Overview
          </ButtonLink>
        </BUIProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Overview').closest('a')).toBeNull();
  });

  it('renders the host href and navigates without a document reload', () => {
    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BUIProvider>
          <ButtonLink href="/catalog/overview">Overview</ButtonLink>
          <LocationStatus />
        </BUIProvider>
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'Overview' });
    expect(link).toHaveAttribute('href', '/app/catalog/overview');
    fireEvent.click(link);
    expect(screen.getByRole('status')).toHaveTextContent('/catalog/overview');
  });

  it('passes the exact options registered by the component to React Aria', () => {
    const navigate = jest.fn();
    const register = jest.fn();
    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <TrackingProvider navigate={navigate} register={register}>
          <ButtonLink
            href="/catalog/overview"
            routerOptions={{ replace: true }}
          >
            Overview
          </ButtonLink>
        </TrackingProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Overview' }));
    const registeredOptions = register.mock.calls[0]?.[0];
    expect(registeredOptions).toBeDefined();
    expect(navigate).toHaveBeenCalledWith(
      '/catalog/overview',
      registeredOptions,
    );
  });

  it('renders the configured host Link with the raw destination', () => {
    const hostLink = jest.fn();
    const HostLink = forwardRef<
      HTMLAnchorElement,
      ComponentProps<typeof RouterLink>
    >((props, ref) => {
      hostLink(props);
      return <RouterLink {...props} ref={ref} />;
    });

    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <TrackingProvider
          navigate={jest.fn()}
          register={jest.fn()}
          link={HostLink}
        >
          <ButtonLink href="child">Overview</ButtonLink>
        </TrackingProvider>
      </MemoryRouter>,
    );

    const hostLinkProps = hostLink.mock.calls.find(
      ([props]) => props.to === 'child',
    )?.[0];
    expect(hostLinkProps).toBeDefined();
    expect(hostLinkProps).not.toHaveProperty('href');
  });
});

function TrackingProvider({
  children,
  navigate,
  register,
  link: Link = RouterLink,
}: PropsWithChildren<{
  navigate: jest.Mock;
  register: jest.Mock;
  link?: BUIRoutingIntegration['Link'];
}>) {
  const routing = useMemo<BUIRoutingIntegration>(
    () => ({
      Link,
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
    [Link, register],
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
