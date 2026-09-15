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

import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createContext, useContext, useState } from 'react';
import { BUIProvider } from '../../provider/BUIProvider';
import type { BUIRouter } from '../../provider/BUIRouter';
import { Link } from './Link';
import type { ButtonLink } from '../ButtonLink';
import type * as TabComponents from '../Tabs';
import { Tabs, TabList, Tab } from '../Tabs';
import { HeaderNav } from '../Header/HeaderNav';

describe('BUI control routing', () => {
  it('keeps native keyboard, cancellation, title and callback refs', async () => {
    const user = userEvent.setup();
    const navigate = jest.fn();
    const ref = jest.fn();
    const cancelled = jest.fn((event: React.MouseEvent) =>
      event.preventDefault(),
    );
    const router = createRouter({
      navigate,
      resolveHref: href => `/base/${href}`,
    });
    const { unmount } = render(
      <BUIProvider useRouter={() => router}>
        <Link href="cancelled" onClick={cancelled}>
          Cancelled
        </Link>
        <Link
          ref={ref}
          href="details"
          title="Complete details"
          data-label="details"
        >
          Details
        </Link>
      </BUIProvider>,
    );
    await user.click(screen.getByRole('link', { name: 'Cancelled' }));
    expect(cancelled).toHaveBeenCalledTimes(1);
    expect(navigate).not.toHaveBeenCalled();

    const details = screen.getByRole('link', { name: 'Details' });
    expect(ref).toHaveBeenLastCalledWith(details);
    expect(details).toHaveAttribute('title', 'Complete details');
    expect(details).toHaveAttribute('data-label', 'details');
    await user.tab();
    expect(details).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenLastCalledWith('details', undefined);
    unmount();
    expect(ref).toHaveBeenLastCalledWith(null);
  });

  it('updates links and active items from a hook at the consumer scope without remounting', () => {
    const Scope = createContext({ base: '/root', active: 'overview' });
    const navigate = jest.fn();
    function useHostRouter(): BUIRouter {
      const { base, active } = useContext(Scope);
      return {
        resolveHref: href => '/base' + base + '/' + href,
        navigate: (href, options) => navigate(base + '/' + href, options),
        pathname: '/base' + base + '/' + active,
      };
    }
    function Content({ extra }: { extra: boolean }) {
      const [count, setCount] = useState(0);
      return (
        <>
          <button onClick={() => setCount(count + 1)}>Count {count}</button>
          <Link href="details">Details</Link>
          <Tabs>
            <TabList>
              <Tab id="overview" href="overview">
                Overview
              </Tab>
              <Tab id="activity" href="activity">
                Activity
              </Tab>
            </TabList>
          </Tabs>
          <HeaderNav
            tabs={[
              { id: 'overview', label: 'Header overview', href: 'overview' },
              { id: 'activity', label: 'Header activity', href: 'activity' },
              ...(extra
                ? [{ id: 'extra', label: 'Header extra', href: 'extra' }]
                : []),
            ]}
          />
        </>
      );
    }
    function Host({
      base,
      active,
      extra = false,
    }: {
      base: string;
      active: string;
      extra?: boolean;
    }) {
      return (
        <BUIProvider useRouter={useHostRouter}>
          <Scope.Provider value={{ base, active }}>
            <Content extra={extra} />
          </Scope.Provider>
        </BUIProvider>
      );
    }
    const { rerender } = render(<Host base="/one" active="overview" />);
    const link = screen.getByRole('link', { name: 'Details' });
    expect(link).toHaveAttribute('href', '/base/one/details');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(
      screen.getByRole('link', { name: 'Header overview' }),
    ).toHaveAttribute('aria-current', 'page');
    fireEvent.click(link);
    expect(navigate).toHaveBeenLastCalledWith('/one/details', undefined);
    fireEvent.click(screen.getByRole('button', { name: 'Count 0' }));

    rerender(<Host base="/two" active="activity" extra />);
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Details' })).toBe(link);
    expect(link).toHaveAttribute('href', '/base/two/details');
    fireEvent.click(link);
    expect(navigate).toHaveBeenCalledTimes(2);
    expect(navigate).toHaveBeenLastCalledWith('/two/details', undefined);
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(
      screen.getByRole('link', { name: 'Header activity' }),
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getByRole('link', { name: 'Header overview' }),
    ).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Header extra' })).toHaveAttribute(
      'href',
      '/base/two/extra',
    );
  });

  it('retains the host router through nested providers', () => {
    const navigate = jest.fn();
    render(
      <BUIProvider
        useRouter={() =>
          createRouter({ navigate, resolveHref: href => `/base${href}` })
        }
      >
        <BUIProvider>
          <Link href="/catalog">Catalog</Link>
        </BUIProvider>
      </BUIProvider>,
    );

    const link = screen.getByRole('link', { name: 'Catalog' });
    expect(link).toHaveAttribute('href', '/base/catalog');
    fireEvent.click(link);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate.mock.calls[0][0]).toBe('/catalog');
  });

  it.each(['shared', 'isolated'] as const)(
    'shares its host with independently loaded BUI components and %s React Aria',
    ariaCopy => {
      const sharedReact = jest.requireActual('react');
      const sharedReactDom = jest.requireActual('react-dom');
      const sharedReactDomClient = jest.requireActual('react-dom/client');
      const sharedReactAria = jest.requireActual('react-aria');
      const sharedReactAriaComponents = jest.requireActual(
        'react-aria-components',
      );
      let IsolatedLink!: typeof Link;
      let IsolatedButtonLink!: typeof ButtonLink;
      let IsolatedTabs!: typeof TabComponents;
      let isolatedReactAria: unknown;

      jest.isolateModules(() => {
        jest.doMock('react', () => sharedReact);
        jest.doMock('react-dom', () => sharedReactDom);
        jest.doMock('react-dom/client', () => sharedReactDomClient);
        if (ariaCopy === 'shared') {
          jest.doMock('react-aria', () => sharedReactAria);
          jest.doMock('react-aria-components', () => sharedReactAriaComponents);
        }
        isolatedReactAria =
          ariaCopy === 'shared'
            ? jest.requireMock('react-aria')
            : jest.requireActual('react-aria');
        ({ Link: IsolatedLink } = jest.requireActual('../Link'));
        ({ ButtonLink: IsolatedButtonLink } =
          jest.requireActual('../ButtonLink'));
        IsolatedTabs = jest.requireActual('../Tabs');
      });
      jest.dontMock('react');
      jest.dontMock('react-dom');
      jest.dontMock('react-dom/client');
      jest.dontMock('react-aria');
      jest.dontMock('react-aria-components');

      expect(IsolatedLink).not.toBe(Link);
      if (ariaCopy === 'isolated') {
        expect(isolatedReactAria).not.toBe(sharedReactAria);
      }
      const { Tabs, TabList, Tab } = IsolatedTabs;
      const navigate = jest.fn();
      const captureEvent = jest.fn();
      const router = createRouter({
        navigate,
        resolveHref: href =>
          href.startsWith('/') ? `/base${href}` : `/base/catalog/${href}`,
        pathname: '/base/catalog/overview',
      });
      render(
        <BUIProvider
          useRouter={() => router}
          useAnalytics={() => ({ captureEvent })}
        >
          <IsolatedLink
            href="details"
            routerOptions={{
              replace: true,
              state: { from: 'catalog' },
            }}
          >
            Details
          </IsolatedLink>
          <IsolatedLink href="export" download="catalog.json">
            Download
          </IsolatedLink>
          <IsolatedLink href="overview" target="documentation">
            Documentation
          </IsolatedLink>
          <IsolatedButtonLink href="create">Create</IsolatedButtonLink>
          <Tabs>
            <TabList>
              <Tab id="overview" href="overview">
                Overview
              </Tab>
              <Tab id="activity" href="activity">
                Activity
              </Tab>
            </TabList>
          </Tabs>
        </BUIProvider>,
      );

      const details = screen.getByRole('link', { name: 'Details' });
      expect(details).toHaveAttribute('href', '/base/catalog/details');
      fireEvent.click(details, { ctrlKey: true });
      for (const [name, href] of [
        ['Download', '/base/catalog/export'],
        ['Documentation', '/base/catalog/overview'],
      ]) {
        const link = screen.getByRole('link', { name });
        expect(link).toHaveAttribute('href', href);
        const click = createEvent.click(link);
        fireEvent(link, click);
        expect(click.defaultPrevented).toBe(false);
      }
      expect(navigate).not.toHaveBeenCalled();

      fireEvent.click(details);
      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenLastCalledWith('details', {
        replace: true,
        state: { from: 'catalog' },
      });
      expect(captureEvent).toHaveBeenCalledWith('click', 'Details', {
        attributes: { to: 'details' },
      });

      const create = screen.getByRole('link', { name: 'Create' });
      expect(create).toHaveAttribute('href', '/base/catalog/create');
      fireEvent.click(create);
      expect(navigate).toHaveBeenCalledTimes(2);
      expect(navigate.mock.calls[1][0]).toBe('create');

      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      const activity = screen.getByRole('tab', { name: 'Activity' });
      expect(activity).toHaveAttribute('href', '/base/catalog/activity');
      fireEvent.click(activity);
      expect(navigate).toHaveBeenCalledTimes(3);
      expect(navigate.mock.calls[2][0]).toBe('activity');
    },
  );
});

function createRouter(overrides: Partial<BUIRouter> = {}): BUIRouter {
  return {
    navigate: jest.fn(),
    resolveHref: href => href,
    pathname: '/',
    ...overrides,
  };
}
