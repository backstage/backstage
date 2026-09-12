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
import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  useMemo,
  type JSX,
  type MutableRefObject,
  type PropsWithChildren,
} from 'react';
import * as ProviderReactAria from 'react-aria';
import * as ProviderReactAriaComponents from 'react-aria-components';
import {
  RouterProvider,
  type GridListItemRenderProps,
} from 'react-aria-components';
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useResolvedHref } from '../../hooks/useResolvedHref';
import { BUIContext, type BUIContextVersions } from '../../provider/BUIContext';
import { BUIProvider } from '../../provider/BUIProvider';
import { List, ListRow } from './List';

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

function LocationStatus() {
  const location = useLocation();

  return (
    <span role="status" data-location-state={JSON.stringify(location.state)}>
      {location.pathname}
    </span>
  );
}

function RouterFixture({ children }: PropsWithChildren) {
  return (
    <MemoryRouter
      basename="/app"
      initialEntries={['/app/catalog/entity/docs']}
      future={routerFuture}
    >
      <BUIProvider>
        <Routes>
          <Route path="catalog/entity/docs/*" element={children} />
        </Routes>
        <LocationStatus />
      </BUIProvider>
    </MemoryRouter>
  );
}

function OldBUIProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const value = useMemo(
    () =>
      createVersionedValueMap({
        1: { useAnalytics: undefined },
      }) as VersionedValue<BUIContextVersions>,
    [],
  );

  return (
    <RouterProvider navigate={navigate} useHref={useResolvedHref}>
      <BUIContext.Provider value={value}>{children}</BUIContext.Provider>
    </RouterProvider>
  );
}

function activate(element: HTMLElement, method: 'click' | 'keyboard') {
  if (method === 'click') {
    fireEvent.click(element);
    return;
  }
  act(() => element.focus());
  fireEvent.keyDown(element, { key: 'Enter', code: 'Enter' });
  fireEvent.keyUp(element, { key: 'Enter', code: 'Enter' });
}

describe('ListRow navigation', () => {
  it.each(['click', 'keyboard'] as const)(
    'uses an ordinary internal href as a component-relative %s action',
    method => {
      const onAction = jest.fn();
      render(
        <List aria-label="Destinations">
          <ListRow id="child" href="child" onAction={onAction}>
            Child
          </ListRow>
        </List>,
        { wrapper: RouterFixture },
      );

      const row = screen.getByRole('row', { name: 'Child' });
      expect(row).toHaveAttribute(
        'data-href',
        '/app/catalog/entity/docs/child',
      );
      activate(row, method);
      expect(screen.getByRole('status')).toHaveTextContent(
        '/catalog/entity/docs/child',
      );
      expect(onAction).toHaveBeenCalledTimes(1);
    },
  );

  it('preserves modifier activation for an ordinary internal href', () => {
    render(
      <List aria-label="Destinations">
        <ListRow id="child" href="child">
          Child
        </ListRow>
      </List>,
      { wrapper: RouterFixture },
    );

    const row = screen.getByRole('row', { name: 'Child' });
    const activated: Array<{
      href: string;
      metaKey: boolean;
      ctrlKey: boolean;
    }> = [];
    const capture = (event: MouseEvent) => {
      if (event.target instanceof HTMLAnchorElement) {
        event.preventDefault();
        activated.push({
          href: event.target.getAttribute('href') ?? '',
          metaKey: event.metaKey,
          ctrlKey: event.ctrlKey,
        });
      }
    };
    document.addEventListener('click', capture, true);
    try {
      fireEvent.click(row, { metaKey: true });
    } finally {
      document.removeEventListener('click', capture, true);
    }
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/docs',
    );
    expect(activated).toEqual([
      { href: '/app/catalog/entity/docs/child', metaKey: true, ctrlKey: false },
    ]);
  });

  it('does not activate an ordinary internal href when disabled', () => {
    const onAction = jest.fn();
    render(
      <List aria-label="Destinations">
        <ListRow id="child" href="child" onAction={onAction} isDisabled>
          Child
        </ListRow>
      </List>,
      { wrapper: RouterFixture },
    );

    fireEvent.click(screen.getByRole('row', { name: 'Child' }));
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/docs',
    );
    expect(onAction).not.toHaveBeenCalled();
  });

  it.each([
    {
      href: 'https://example.test/docs',
      expectedHref: 'https://example.test/docs',
    },
    {
      href: 'mailto:owner@example.test',
      expectedHref: 'mailto:owner@example.test',
    },
    { href: '/catalog', target: '_blank', expectedHref: '/app/catalog' },
    { href: '/catalog', target: 'preview', expectedHref: '/app/catalog' },
    { href: '/catalog', target: '_parent', expectedHref: '/app/catalog' },
    { href: '/catalog', target: '_top', expectedHref: '/app/catalog' },
    { href: '/catalog', download: true, expectedHref: '/app/catalog' },
    {
      href: '/catalog',
      download: 'catalog.csv',
      expectedHref: '/app/catalog',
    },
  ])(
    'preserves native ListRow navigation for $href $target $download',
    ({ href, target, download, expectedHref }) => {
      render(
        <List aria-label="Destinations">
          <ListRow
            id="destination"
            href={href}
            target={target}
            rel="author"
            ping="/navigation-ping"
            download={download}
            referrerPolicy="no-referrer"
          >
            Destination
          </ListRow>
        </List>,
        { wrapper: RouterFixture },
      );

      const row = screen.getByRole('row', { name: 'Destination' });
      expect(row).toHaveAttribute('data-href', expectedHref);
      expect(row).toHaveAttribute('data-rel', 'author');
      expect(row).toHaveAttribute('data-ping', '/navigation-ping');
      expect(row).toHaveAttribute('data-referrer-policy', 'no-referrer');
      if (target) {
        expect(row).toHaveAttribute('data-target', target);
      }
      if (download !== undefined) {
        expect(row).toHaveAttribute('data-download', String(download));
      }
    },
  );

  it('uses router options for an ordinary internal relative href', () => {
    render(
      <List aria-label="Destinations">
        <ListRow
          id="child"
          href="child"
          routerOptions={{ replace: true, state: { source: 'list-row' } }}
        >
          Child
        </ListRow>
      </List>,
      { wrapper: RouterFixture },
    );

    const row = screen.getByRole('row', { name: 'Child' });
    expect(row).toHaveAttribute('data-href', '/app/catalog/entity/docs/child');
    fireEvent.click(row);
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/docs/child',
    );
    expect(screen.getByRole('status')).toHaveAttribute(
      'data-location-state',
      '{"source":"list-row"}',
    );
  });

  it('keeps native keyboard action and selection behavior in React Aria', () => {
    const onPress = jest.fn();
    render(
      <List
        aria-label="Destinations"
        selectionMode="multiple"
        selectionBehavior="toggle"
        defaultSelectedKeys={['destination']}
      >
        <ListRow
          id="destination"
          href="/catalog"
          target="_blank"
          onPress={onPress}
        >
          Destination
        </ListRow>
      </List>,
      { wrapper: RouterFixture },
    );

    const row = screen.getByRole('row', { name: 'Destination' });
    expect(row).toHaveAttribute('aria-selected', 'true');
    act(() => row.focus());
    fireEvent.keyDown(row, { key: 'Enter', code: 'Enter' });
    fireEvent.keyUp(row, { key: 'Enter', code: 'Enter' });
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(row).toHaveAttribute('aria-selected', 'true');
  });

  it('preserves consumer render state, DOM props, content, and refs', () => {
    let renderedElement: HTMLDivElement | null = null;
    const consumerRender = jest.fn(
      (
        domProps: JSX.IntrinsicElements['div'],
        renderProps: GridListItemRenderProps,
      ) => (
        <div
          {...domProps}
          ref={element => {
            const renderRef = domProps.ref;
            if (typeof renderRef === 'function') {
              renderRef(element);
            } else if (renderRef) {
              (renderRef as MutableRefObject<HTMLDivElement | null>).current =
                element;
            }
            renderedElement = element;
          }}
          data-href="/consumer"
          data-selected={String(renderProps.isSelected)}
        />
      ),
    );
    render(
      <List aria-label="Destinations">
        <ListRow
          id="destination"
          href="/catalog"
          target="_blank"
          aria-label="Catalog destination"
          className="consumer-row"
          render={consumerRender}
        >
          Catalog
        </ListRow>
      </List>,
      { wrapper: RouterFixture },
    );

    const row = screen.getByRole('row', { name: 'Catalog destination' });
    expect(row.tagName).toBe('DIV');
    expect(row).toHaveClass('bui-ListRow', 'consumer-row');
    expect(row).toHaveAttribute('data-href', '/consumer');
    expect(row).toHaveAttribute('data-selected', 'false');
    expect(row).toHaveTextContent('Catalog');
    expect(renderedElement).toBe(row);
    expect(consumerRender).toHaveBeenCalledWith(
      expect.objectContaining({
        'aria-label': 'Catalog destination',
        'data-href': '/app/catalog',
      }),
      expect.objectContaining({ isSelected: false }),
    );
  });

  it('keeps raw native hrefs outside React Router', () => {
    render(
      <List aria-label="Destinations">
        <ListRow id="destination" href="https://example.test/docs">
          Destination
        </ListRow>
      </List>,
    );

    expect(screen.getByRole('row', { name: 'Destination' })).toHaveAttribute(
      'data-href',
      'https://example.test/docs',
    );
  });

  it.each([
    ['V2', 'shared'],
    ['V2', 'isolated'],
    ['V1-only', 'shared'],
    ['V1-only', 'isolated'],
  ] as const)(
    'applies the basename once under a %s host with %s React Aria',
    (provider, reactAriaGraph) => {
      const sharedReact = jest.requireActual<typeof import('react')>('react');
      const sharedReactDom =
        jest.requireActual<typeof import('react-dom')>('react-dom');
      const sharedReactDomClient =
        jest.requireActual<typeof import('react-dom/client')>(
          'react-dom/client',
        );
      const sharedReactRouter =
        jest.requireActual<typeof import('react-router')>('react-router');
      const sharedReactRouterDom =
        jest.requireActual<typeof import('react-router-dom')>(
          'react-router-dom',
        );
      let IsolatedList!: typeof List;
      let IsolatedListRow!: typeof ListRow;
      let IsolatedReactAria!: typeof ProviderReactAria;
      let IsolatedReactAriaComponents!: typeof ProviderReactAriaComponents;
      let IsolatedRouterDom!: typeof sharedReactRouterDom;

      jest.isolateModules(() => {
        jest.doMock('react', () => sharedReact);
        jest.doMock('react-dom', () => sharedReactDom);
        jest.doMock('react-dom/client', () => sharedReactDomClient);
        jest.doMock('react-router', () => sharedReactRouter);
        jest.doMock('react-router-dom', () => sharedReactRouterDom);
        if (reactAriaGraph === 'shared') {
          jest.doMock('react-aria', () => ProviderReactAria);
          jest.doMock(
            'react-aria-components',
            () => ProviderReactAriaComponents,
          );
        } else {
          jest.dontMock('react-aria');
          jest.dontMock('react-aria-components');
        }
        IsolatedReactAria =
          reactAriaGraph === 'shared'
            ? jest.requireMock('react-aria')
            : jest.requireActual('react-aria');
        IsolatedReactAriaComponents =
          reactAriaGraph === 'shared'
            ? jest.requireMock('react-aria-components')
            : jest.requireActual('react-aria-components');
        IsolatedRouterDom = jest.requireMock('react-router-dom');
        ({ List: IsolatedList, ListRow: IsolatedListRow } =
          jest.requireActual('./List'));
      });

      jest.dontMock('react-aria');
      jest.dontMock('react-aria-components');
      expect(IsolatedReactAria === ProviderReactAria).toBe(
        reactAriaGraph === 'shared',
      );
      expect(IsolatedReactAriaComponents === ProviderReactAriaComponents).toBe(
        reactAriaGraph === 'shared',
      );
      expect(IsolatedRouterDom).toBe(sharedReactRouterDom);

      const content = (
        <IsolatedList aria-label="Destinations">
          <IsolatedListRow id="destination" href="child">
            Destination
          </IsolatedListRow>
        </IsolatedList>
      );
      render(
        <MemoryRouter
          basename="/app"
          initialEntries={['/app/catalog/entity/docs']}
          future={routerFuture}
        >
          {provider === 'V2' ? (
            <BUIProvider>{content}</BUIProvider>
          ) : (
            <OldBUIProvider>{content}</OldBUIProvider>
          )}
          <LocationStatus />
        </MemoryRouter>,
      );

      const row = screen.getByRole('row', { name: 'Destination' });
      expect(row).toHaveAttribute('data-href', '/app/child');
      fireEvent.click(row);
      expect(screen.getByRole('status')).toHaveTextContent('/child');
    },
  );
});
