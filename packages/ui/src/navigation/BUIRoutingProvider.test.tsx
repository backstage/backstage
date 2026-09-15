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

import { createContext, useContext, useState } from 'react';
import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import { Link, RouterProvider, type LinkProps } from 'react-aria-components';
import { MemoryRouter } from 'react-router-dom';
import { BUIProvider } from '../provider/BUIProvider';
import type { BUIRouter } from '../provider/BUIRouter';
import { BUIRoutingProvider } from './BUIRoutingProvider';

describe('BUIRoutingProvider', () => {
  it('does not bind a host at the outer BUIProvider', () => {
    const useHostRouter = jest.fn(
      (): BUIRouter => ({
        navigate: jest.fn(),
        resolveHref: href => `/root/${href}`,
        pathname: '/root',
      }),
    );
    render(
      <BUIProvider useRouter={useHostRouter}>
        <Link href="details">Direct Aria link</Link>
      </BUIProvider>,
    );
    const link = screen.getByRole('link', { name: 'Direct Aria link' });
    expect(link).toHaveAttribute('href', 'details');
    const click = createEvent.click(link);
    fireEvent(link, click);
    expect(click.defaultPrevented).toBe(false);
    expect(useHostRouter).not.toHaveBeenCalled();
  });

  it('binds an independently loaded React Aria copy to the shared BUI host', () => {
    const sharedReact = jest.requireActual('react');
    const sharedReactDom = jest.requireActual('react-dom');
    const sharedReactDomClient = jest.requireActual('react-dom/client');
    let IsolatedProvider!: typeof BUIRoutingProvider;
    let IsolatedLink!: typeof Link;
    jest.isolateModules(() => {
      jest.doMock('react', () => sharedReact);
      jest.doMock('react-dom', () => sharedReactDom);
      jest.doMock('react-dom/client', () => sharedReactDomClient);
      ({ BUIRoutingProvider: IsolatedProvider } = jest.requireActual(
        './BUIRoutingProvider',
      ));
      ({ Link: IsolatedLink } = jest.requireActual('react-aria-components'));
    });
    jest.dontMock('react');
    jest.dontMock('react-dom');
    jest.dontMock('react-dom/client');
    expect(IsolatedProvider).not.toBe(BUIRoutingProvider);
    expect(IsolatedLink).not.toBe(Link);

    const navigate = jest.fn();
    const options = { replace: true, state: { from: 'isolated' } };
    render(
      <BUIProvider
        useRouter={() => ({
          navigate,
          resolveHref: href => `/base/catalog/${href}`,
          pathname: '/base/catalog',
        })}
      >
        <IsolatedProvider>
          <IsolatedLink
            // Model an app's router options without globally augmenting Aria in this monorepo.
            {...({
              href: 'details',
              routerOptions: options,
            } as unknown as LinkProps)}
          >
            Details
          </IsolatedLink>
        </IsolatedProvider>
      </BUIProvider>,
    );
    const link = screen.getByRole('link', { name: 'Details' });
    expect(link).toHaveAttribute('href', '/base/catalog/details');
    fireEvent.click(link, { ctrlKey: true });
    expect(navigate).not.toHaveBeenCalled();
    fireEvent.click(link);
    expect(navigate).toHaveBeenCalledWith('details', options);
    expect(navigate.mock.calls[0][1]).toBe(options);
  });

  it('binds resolution and navigation at the same scope and updates without remounting', () => {
    const Scope = createContext('/root');
    const navigate = jest.fn();
    function useHostRouter(): BUIRouter {
      const base = useContext(Scope);
      return {
        resolveHref: href => `/base${base}/${href}`,
        navigate: (href, options) => navigate(`${base}/${href}`, options),
        pathname: `/base${base}`,
      };
    }
    function Content() {
      const [count, setCount] = useState(0);
      return (
        <>
          <button onClick={() => setCount(count + 1)}>Count {count}</button>
          <Link
            {...({
              href: 'details',
              routerOptions: { replace: true, state: { from: 'catalog' } },
            } as unknown as LinkProps)}
          >
            Details
          </Link>
        </>
      );
    }
    function Host({ base }: { base: string }) {
      return (
        <BUIProvider useRouter={useHostRouter}>
          <Scope.Provider value={base}>
            <BUIRoutingProvider>
              <Scope.Provider value="/deeper">
                <Content />
              </Scope.Provider>
            </BUIRoutingProvider>
          </Scope.Provider>
        </BUIProvider>
      );
    }

    const { rerender } = render(<Host base="/one" />);
    const link = screen.getByRole('link', { name: 'Details' });
    expect(link).toHaveAttribute('href', '/base/one/details');
    fireEvent.click(link);
    expect(navigate).toHaveBeenLastCalledWith('/one/details', {
      replace: true,
      state: { from: 'catalog' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Count 0' }));
    rerender(<Host base="/two" />);
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Details' })).toBe(link);
    expect(link).toHaveAttribute('href', '/base/two/details');
    fireEvent.click(link);
    expect(navigate).toHaveBeenCalledTimes(2);
    expect(navigate).toHaveBeenLastCalledWith('/two/details', {
      replace: true,
      state: { from: 'catalog' },
    });
  });

  it('leaves eligibility and cancellation to React Aria', () => {
    const navigate = jest.fn();
    render(
      <BUIProvider
        useRouter={() => ({
          navigate,
          resolveHref: href => href,
          pathname: '/',
        })}
      >
        <BUIRoutingProvider>
          <Link href="/catalog">Catalog</Link>
          <Link href="/export" download="catalog.json">
            Download
          </Link>
          <Link href="/docs" target="documentation">
            Documentation
          </Link>
          <Link href="https://example.com/">External</Link>
          <Link href="/cancelled" onClick={event => event.preventDefault()}>
            Cancelled
          </Link>
        </BUIRoutingProvider>
      </BUIProvider>,
    );
    const catalog = screen.getByRole('link', { name: 'Catalog' });
    for (const modifier of ['ctrlKey', 'metaKey', 'altKey', 'shiftKey']) {
      const click = createEvent.click(catalog, { [modifier]: true });
      fireEvent(catalog, click);
      expect(click.defaultPrevented).toBe(false);
    }
    for (const name of ['Download', 'Documentation', 'External']) {
      const link = screen.getByRole('link', { name });
      const click = createEvent.click(link);
      fireEvent(link, click);
      expect(click.defaultPrevented).toBe(false);
    }
    fireEvent.click(screen.getByRole('link', { name: 'Cancelled' }));
    expect(navigate).not.toHaveBeenCalled();
    fireEvent.click(catalog);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('/catalog', undefined);
  });

  it('leaves browser-owned same-origin URLs out of the host router', () => {
    const navigate = jest.fn();
    const href = `${window.location.origin}/#browser-owned`;
    render(
      <BUIProvider
        useRouter={() => ({
          navigate,
          resolveHref: value => value,
          pathname: '/',
        })}
      >
        <BUIRoutingProvider>
          <Link href={href}>Browser destination</Link>
        </BUIRoutingProvider>
      </BUIProvider>,
    );
    fireEvent.click(screen.getByRole('link', { name: 'Browser destination' }));
    expect(navigate).not.toHaveBeenCalled();
    expect(window.location.hash).toBe('#browser-owned');
    window.history.replaceState(null, '', '/');
  });

  it('uses native browser behavior without an explicit host even inside React Router', () => {
    render(
      <MemoryRouter
        basename="/base"
        initialEntries={['/base/catalog']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BUIProvider>
          <BUIRoutingProvider>
            <Link href="details">Details</Link>
          </BUIRoutingProvider>
        </BUIProvider>
      </MemoryRouter>,
    );
    const link = screen.getByRole('link', { name: 'Details' });
    expect(link).toHaveAttribute('href', 'details');
    const click = createEvent.click(link);
    fireEvent(link, click);
    expect(click.defaultPrevented).toBe(false);
  });

  it('preserves an explicitly supplied React Aria provider when there is no BUI host', () => {
    const navigate = jest.fn();
    render(
      <RouterProvider navigate={navigate} useHref={href => `/explicit/${href}`}>
        <BUIProvider>
          <BUIRoutingProvider>
            <Link href="details">Details</Link>
          </BUIRoutingProvider>
        </BUIProvider>
      </RouterProvider>,
    );
    const link = screen.getByRole('link', { name: 'Details' });
    expect(link).toHaveAttribute('href', '/explicit/details');
    fireEvent.click(link);
    expect(navigate).toHaveBeenCalledWith('details', undefined);
  });
});
