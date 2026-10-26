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

import { act, fireEvent, render, screen } from '@testing-library/react';
import type { JSX, MutableRefObject, PropsWithChildren } from 'react';
import * as ProviderReactAria from 'react-aria';
import * as ProviderReactAriaComponents from 'react-aria-components';
import type { Key, RowRenderProps } from 'react-aria-components';
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { BUIProvider } from '../../../provider/BUIProvider';
import { Cell } from './Cell';
import { Column } from './Column';
import { Row } from './Row';
import { TableBody } from './TableBody';
import { TableHeader } from './TableHeader';
import { TableRoot } from './TableRoot';
import type { RowProps as BuiRowProps } from '../types';

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

function HistoryBackButton() {
  const navigate = useNavigate();

  return <button onClick={() => navigate(-1)}>Back</button>;
}

function TableFixture({
  children,
  selectionMode,
  selectionBehavior,
  defaultSelectedKeys,
}: PropsWithChildren<{
  selectionMode?: 'none' | 'single' | 'multiple';
  selectionBehavior?: 'toggle' | 'replace';
  defaultSelectedKeys?: Iterable<Key>;
}>) {
  return (
    <TableRoot
      aria-label="Destinations"
      selectionMode={selectionMode}
      selectionBehavior={selectionBehavior}
      defaultSelectedKeys={defaultSelectedKeys}
    >
      <TableHeader>
        <Column isRowHeader>Name</Column>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </TableRoot>
  );
}

function RouterFixture({
  children,
  captureEvent,
  showBackButton,
}: PropsWithChildren<{ captureEvent?: jest.Mock; showBackButton?: boolean }>) {
  return (
    <MemoryRouter
      basename="/app"
      initialEntries={['/app/catalog/entity/docs']}
      future={routerFuture}
    >
      <BUIProvider
        useAnalytics={captureEvent ? () => ({ captureEvent }) : undefined}
      >
        <Routes>
          <Route path="catalog/entity/docs/*" element={children} />
        </Routes>
        <LocationStatus />
        {showBackButton && <HistoryBackButton />}
      </BUIProvider>
    </MemoryRouter>
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

describe('Row navigation', () => {
  it.each(['click', 'keyboard'] as const)(
    'uses an ordinary internal href as a component-relative %s action',
    method => {
      const onAction = jest.fn();
      const captureEvent = jest.fn();
      render(
        <RouterFixture captureEvent={captureEvent}>
          <TableFixture>
            <Row id="child" href="child" onAction={onAction}>
              <Cell>Child</Cell>
            </Row>
          </TableFixture>
        </RouterFixture>,
      );

      const row = screen.getByRole('row', { name: 'Child' });
      expect(row).toHaveAttribute(
        'data-href',
        '/app/catalog/entity/docs/child',
      );
      expect(row).toHaveAttribute('data-react-aria-pressable', 'true');
      activate(row, method);
      expect(screen.getByRole('status')).toHaveTextContent(
        '/catalog/entity/docs/child',
      );
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(captureEvent).toHaveBeenCalledWith('click', 'child', {
        attributes: { to: 'child' },
      });
    },
  );

  it.each([
    ['Cmd', { metaKey: true }, { metaKey: true, ctrlKey: false }],
    ['Ctrl', { ctrlKey: true }, { metaKey: false, ctrlKey: true }],
  ] as const)(
    'preserves %s activation for an ordinary internal href',
    (_modifier, modifier, expectedModifier) => {
      const onAction = jest.fn();
      const captureEvent = jest.fn();
      render(
        <RouterFixture captureEvent={captureEvent}>
          <TableFixture>
            <Row id="child" href="child" onAction={onAction}>
              <Cell>Child</Cell>
            </Row>
          </TableFixture>
        </RouterFixture>,
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
        fireEvent.click(row, modifier);
      } finally {
        document.removeEventListener('click', capture, true);
      }

      expect(screen.getByRole('status')).toHaveTextContent(
        '/catalog/entity/docs',
      );
      expect(activated).toEqual([
        {
          href: '/app/catalog/entity/docs/child',
          ...expectedModifier,
        },
      ]);
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(captureEvent).toHaveBeenCalledTimes(1);
      expect(captureEvent).toHaveBeenCalledWith('click', 'child', {
        attributes: { to: 'child' },
      });
    },
  );

  it('does not activate an ordinary internal href when disabled', () => {
    const onAction = jest.fn();
    render(
      <TableFixture>
        <Row id="child" href="child" onAction={onAction} isDisabled>
          <Cell>Child</Cell>
        </Row>
      </TableFixture>,
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
      target: '_blank',
    },
    {
      href: 'mailto:owner@example.test',
      expectedHref: 'mailto:owner@example.test',
      target: '_blank',
    },
    { href: '/catalog', expectedHref: '/app/catalog', target: '_blank' },
    { href: '/catalog', expectedHref: '/app/catalog', target: 'preview' },
    { href: '/catalog', expectedHref: '/app/catalog', target: '_parent' },
    { href: '/catalog', expectedHref: '/app/catalog', target: '_top' },
    { href: '/catalog', expectedHref: '/app/catalog', download: true },
    {
      href: '/catalog',
      expectedHref: '/app/catalog',
      download: 'catalog.csv',
    },
  ])(
    'preserves native Row navigation for $href $target $download',
    ({ href, expectedHref, target, download }) => {
      render(
        <TableFixture>
          <Row
            id="destination"
            href={href}
            target={target}
            rel="author"
            ping="/navigation-ping"
            download={download}
            referrerPolicy="no-referrer"
          >
            <Cell>Destination</Cell>
          </Row>
        </TableFixture>,
        { wrapper: RouterFixture },
      );

      const row = screen.getByRole('row', { name: 'Destination' });
      expect(row).toHaveAttribute('data-href', expectedHref);
      expect(row).toHaveAttribute('data-ping', '/navigation-ping');
      expect(row).toHaveAttribute('data-referrer-policy', 'no-referrer');
      if (target) {
        expect(row).toHaveAttribute('data-target', target);
      }
      if (target === '_blank') {
        expect(row).toHaveAttribute('data-rel', 'noopener noreferrer author');
      } else {
        expect(row).toHaveAttribute('data-rel', 'author');
      }
      if (download !== undefined) {
        expect(row).toHaveAttribute('data-download', String(download));
      }
    },
  );

  it('uses router options for an ordinary internal relative href', () => {
    render(
      <RouterFixture showBackButton>
        <TableFixture>
          <Row
            id="child"
            href="child"
            routerOptions={{ replace: true, state: { source: 'table-row' } }}
          >
            <Cell>Child</Cell>
          </Row>
        </TableFixture>
      </RouterFixture>,
    );

    const row = screen.getByRole('row', { name: 'Child' });
    expect(row).toHaveAttribute('data-href', '/app/catalog/entity/docs/child');
    fireEvent.click(row);
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/docs/child',
    );
    expect(screen.getByRole('status')).toHaveAttribute(
      'data-location-state',
      '{"source":"table-row"}',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/docs/child',
    );
  });

  it('keeps native keyboard action and table selection cells in React Aria', () => {
    const onPress = jest.fn();
    render(
      <TableFixture
        selectionMode="multiple"
        selectionBehavior="toggle"
        defaultSelectedKeys={['destination']}
      >
        <Row id="destination" href="/catalog" target="_blank" onPress={onPress}>
          <Cell>Destination</Cell>
        </Row>
      </TableFixture>,
      { wrapper: RouterFixture },
    );

    expect(screen.getByRole('checkbox', { name: /Select row/ })).toBeChecked();
    const row = screen.getByRole('row', { name: /Destination/ });
    expect(row).toHaveAttribute('aria-selected', 'true');
    act(() => row.focus());
    fireEvent.keyDown(row, { key: 'Enter', code: 'Enter' });
    fireEvent.keyUp(row, { key: 'Enter', code: 'Enter' });
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('preserves consumer render state, DOM props, content, and refs', () => {
    let renderedElement: HTMLTableRowElement | null = null;
    const consumerRender = jest.fn<
      ReturnType<NonNullable<BuiRowProps<object>['render']>>,
      Parameters<NonNullable<BuiRowProps<object>['render']>>
    >((domProps, renderProps: RowRenderProps) => {
      const rowProps = domProps as JSX.IntrinsicElements['tr'];
      return (
        <tr
          {...rowProps}
          ref={element => {
            const renderRef = rowProps.ref;
            if (typeof renderRef === 'function') {
              renderRef(element);
            } else if (renderRef) {
              (
                renderRef as MutableRefObject<HTMLTableRowElement | null>
              ).current = element;
            }
            renderedElement = element;
          }}
          data-href="/consumer"
          data-selected={String(renderProps.isSelected)}
        />
      );
    });
    render(
      <TableFixture selectionMode="multiple" selectionBehavior="toggle">
        <Row
          id="destination"
          href="/catalog"
          target="_blank"
          aria-label="Catalog destination"
          className="consumer-row"
          render={consumerRender}
        >
          <Cell>Catalog</Cell>
        </Row>
      </TableFixture>,
      { wrapper: RouterFixture },
    );

    const row = screen.getByRole('row', { name: /Catalog/ });
    expect(row.tagName).toBe('TR');
    expect(row).toHaveClass('bui-TableRow', 'consumer-row');
    expect(row).toHaveAttribute('data-href', '/consumer');
    expect(row).toHaveAttribute('data-selected', 'false');
    expect(row).toHaveAttribute('aria-labelledby');
    expect(row).toHaveTextContent('Catalog');
    expect(screen.getByRole('checkbox', { name: /Select row/ })).toBeVisible();
    expect(renderedElement).toBe(row);
    expect(consumerRender).toHaveBeenCalledWith(
      expect.objectContaining({
        'aria-labelledby': expect.any(String),
        'data-href': '/app/catalog',
      }),
      expect.objectContaining({ isSelected: false }),
    );
  });

  it('keeps raw native hrefs outside React Router', () => {
    render(
      <TableFixture>
        <Row id="destination" href="https://example.test/docs">
          <Cell>Destination</Cell>
        </Row>
      </TableFixture>,
    );

    const row = screen.getByRole('row', { name: 'Destination' });
    expect(row).toHaveAttribute('data-href', 'https://example.test/docs');
    expect(row).toHaveAttribute('data-target', '_blank');
    expect(row).toHaveAttribute('data-rel', 'noopener noreferrer');
  });

  it('routes an ordinary internal href with an isolated React Aria V2 graph', () => {
    const sharedReact = jest.requireActual<typeof import('react')>('react');
    const sharedReactDom =
      jest.requireActual<typeof import('react-dom')>('react-dom');
    const sharedReactDomClient =
      jest.requireActual<typeof import('react-dom/client')>('react-dom/client');
    const sharedReactRouter =
      jest.requireActual<typeof import('react-router')>('react-router');
    const sharedReactRouterDom =
      jest.requireActual<typeof import('react-router-dom')>('react-router-dom');
    let IsolatedCell!: typeof Cell;
    let IsolatedColumn!: typeof Column;
    let IsolatedRow!: typeof Row;
    let IsolatedTableBody!: typeof TableBody;
    let IsolatedTableHeader!: typeof TableHeader;
    let IsolatedTableRoot!: typeof TableRoot;
    let IsolatedReactAria!: typeof ProviderReactAria;
    let IsolatedReactAriaComponents!: typeof ProviderReactAriaComponents;

    jest.isolateModules(() => {
      jest.doMock('react', () => sharedReact);
      jest.doMock('react-dom', () => sharedReactDom);
      jest.doMock('react-dom/client', () => sharedReactDomClient);
      jest.doMock('react-router', () => sharedReactRouter);
      jest.doMock('react-router-dom', () => sharedReactRouterDom);
      jest.dontMock('react-aria');
      jest.dontMock('react-aria-components');
      IsolatedReactAria = jest.requireActual('react-aria');
      IsolatedReactAriaComponents = jest.requireActual('react-aria-components');
      ({ Cell: IsolatedCell } = jest.requireActual('./Cell'));
      ({ Column: IsolatedColumn } = jest.requireActual('./Column'));
      ({ Row: IsolatedRow } = jest.requireActual('./Row'));
      ({ TableBody: IsolatedTableBody } = jest.requireActual('./TableBody'));
      ({ TableHeader: IsolatedTableHeader } =
        jest.requireActual('./TableHeader'));
      ({ TableRoot: IsolatedTableRoot } = jest.requireActual('./TableRoot'));
    });

    jest.dontMock('react-aria');
    jest.dontMock('react-aria-components');
    expect(IsolatedReactAria).not.toBe(ProviderReactAria);
    expect(IsolatedReactAriaComponents).not.toBe(ProviderReactAriaComponents);

    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog/entity/docs']}
        future={routerFuture}
      >
        <BUIProvider>
          <Routes>
            <Route
              path="catalog/entity/docs/*"
              element={
                <IsolatedTableRoot aria-label="Destinations">
                  <IsolatedTableHeader>
                    <IsolatedColumn isRowHeader>Name</IsolatedColumn>
                  </IsolatedTableHeader>
                  <IsolatedTableBody>
                    <IsolatedRow id="destination" href="child">
                      <IsolatedCell>Destination</IsolatedCell>
                    </IsolatedRow>
                  </IsolatedTableBody>
                </IsolatedTableRoot>
              }
            />
          </Routes>
        </BUIProvider>
        <LocationStatus />
      </MemoryRouter>,
    );

    const row = screen.getByRole('row', { name: 'Destination' });
    expect(row).toHaveAttribute('data-href', '/app/catalog/entity/docs/child');
    fireEvent.click(row);
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/docs/child',
    );
  });
});
