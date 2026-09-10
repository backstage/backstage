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
import { createRef, type JSX, type PropsWithChildren } from 'react';
import * as ProviderReactAria from 'react-aria';
import * as ProviderReactAriaComponents from 'react-aria-components';
import type { TagRenderProps } from 'react-aria-components';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { BUIProvider } from '../../provider/BUIProvider';
import { Tag, TagGroup } from './TagGroup';

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

function LocationStatus() {
  return <span role="status">{useLocation().pathname}</span>;
}

function RouterFixture({
  children,
  captureEvent,
}: PropsWithChildren<{ captureEvent?: jest.Mock }>) {
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

describe('Tag navigation', () => {
  it.each(['click', 'keyboard'] as const)(
    'uses an ordinary internal href as a component-relative %s action',
    method => {
      const onPress = jest.fn();
      const onAction = jest.fn();
      const captureEvent = jest.fn();
      render(
        <RouterFixture captureEvent={captureEvent}>
          <TagGroup aria-label="Destinations">
            <Tag id="child" href="child" onAction={onAction} onPress={onPress}>
              Child
            </Tag>
          </TagGroup>
        </RouterFixture>,
      );

      const tag = screen.getByRole('row', { name: 'Child' });
      expect(tag).toHaveAttribute(
        'data-href',
        '/app/catalog/entity/docs/child',
      );
      activate(tag, method);
      expect(screen.getByRole('status')).toHaveTextContent(
        '/catalog/entity/docs/child',
      );
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(onPress).toHaveBeenCalledTimes(1);
      expect(captureEvent).toHaveBeenCalledWith('click', 'Child', {
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
      const onPress = jest.fn();
      const onAction = jest.fn();
      const captureEvent = jest.fn();
      render(
        <RouterFixture captureEvent={captureEvent}>
          <TagGroup aria-label="Destinations">
            <Tag id="child" href="child" onAction={onAction} onPress={onPress}>
              Child
            </Tag>
          </TagGroup>
        </RouterFixture>,
      );

      const tag = screen.getByRole('row', { name: 'Child' });
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
        fireEvent.click(tag, modifier);
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
      expect(onPress).toHaveBeenCalledTimes(1);
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(captureEvent).toHaveBeenCalledTimes(1);
      expect(captureEvent).toHaveBeenCalledWith('click', 'Child', {
        attributes: { to: 'child' },
      });
    },
  );

  it('does not activate an ordinary internal href when disabled', () => {
    const onPress = jest.fn();
    render(
      <RouterFixture>
        <TagGroup aria-label="Destinations">
          <Tag id="child" href="child" onPress={onPress} isDisabled>
            Child
          </Tag>
        </TagGroup>
      </RouterFixture>,
    );

    fireEvent.click(screen.getByRole('row', { name: 'Child' }));
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/docs',
    );
    expect(onPress).not.toHaveBeenCalled();
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
    'preserves native Tag navigation for $href $target $download',
    ({ href, expectedHref, target, download }) => {
      render(
        <RouterFixture>
          <TagGroup aria-label="Destinations">
            <Tag
              id="destination"
              href={href}
              target={target}
              rel="author"
              ping="/navigation-ping"
              download={download}
              referrerPolicy="no-referrer"
            >
              Destination
            </Tag>
          </TagGroup>
        </RouterFixture>,
      );

      const tag = screen.getByRole('row', { name: 'Destination' });
      expect(tag).toHaveAttribute('data-href', expectedHref);
      expect(tag).toHaveAttribute('data-rel', 'author');
      expect(tag).toHaveAttribute('data-ping', '/navigation-ping');
      expect(tag).toHaveAttribute('data-referrer-policy', 'no-referrer');
      if (target) {
        expect(tag).toHaveAttribute('data-target', target);
      }
      if (download !== undefined) {
        expect(tag).toHaveAttribute('data-download', String(download));
      }
    },
  );

  it('keeps native keyboard action and tag selection in React Aria', () => {
    const onPress = jest.fn();
    render(
      <RouterFixture>
        <TagGroup
          aria-label="Destinations"
          selectionMode="multiple"
          selectionBehavior="toggle"
          defaultSelectedKeys={['destination']}
        >
          <Tag
            id="destination"
            href="/catalog"
            target="_blank"
            onPress={onPress}
          >
            Destination
          </Tag>
        </TagGroup>
      </RouterFixture>,
    );

    const tag = screen.getByRole('row', { name: 'Destination' });
    expect(tag).toHaveAttribute('aria-selected', 'true');
    act(() => tag.focus());
    fireEvent.keyDown(tag, { key: 'Enter', code: 'Enter' });
    fireEvent.keyUp(tag, { key: 'Enter', code: 'Enter' });
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(tag).toHaveAttribute('aria-selected', 'true');
  });

  it('does not select a linked tag in a multiple-selection group', () => {
    render(
      <RouterFixture>
        <TagGroup aria-label="Destinations" selectionMode="multiple">
          <Tag id="destination" href="/catalog" target="_blank">
            Destination
          </Tag>
        </TagGroup>
      </RouterFixture>,
    );

    const tag = screen.getByRole('row', { name: 'Destination' });
    expect(tag).toHaveAttribute('aria-selected', 'false');
    fireEvent.click(tag);
    expect(tag).toHaveAttribute('aria-selected', 'false');
  });

  it('preserves consumer render state, DOM props, content, removal, and refs', () => {
    const ref = createRef<HTMLDivElement>();
    const onRemove = jest.fn();
    const consumerRender = jest.fn(
      (domProps: JSX.IntrinsicElements['div'], renderProps: TagRenderProps) => (
        <div
          {...domProps}
          data-href="/consumer"
          data-removable={String(renderProps.allowsRemoving)}
        />
      ),
    );
    render(
      <RouterFixture>
        <TagGroup aria-label="Destinations" onRemove={onRemove}>
          <Tag
            ref={ref}
            id="destination"
            href="/catalog"
            target="_blank"
            aria-label="Catalog destination"
            className="consumer-tag"
            render={consumerRender}
          >
            Catalog
          </Tag>
        </TagGroup>
      </RouterFixture>,
    );

    const tag = screen.getByRole('row', { name: 'Catalog destination' });
    expect(tag.tagName).toBe('DIV');
    expect(tag).toHaveClass('bui-Tag', 'consumer-tag');
    expect(tag).toHaveAttribute('data-href', '/consumer');
    expect(tag).toHaveAttribute('data-removable', 'true');
    expect(tag).toHaveTextContent('Catalog');
    expect(ref.current).toBe(tag);
    expect(consumerRender).toHaveBeenCalledWith(
      expect.objectContaining({
        'aria-label': 'Catalog destination',
        'data-href': '/app/catalog',
      }),
      expect.objectContaining({ allowsRemoving: true }),
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onRemove).toHaveBeenCalledWith(new Set(['destination']));
  });

  it('keeps raw native hrefs outside React Router', () => {
    render(
      <TagGroup aria-label="Destinations">
        <Tag id="destination" href="https://example.test/docs">
          Destination
        </Tag>
      </TagGroup>,
    );

    expect(screen.getByRole('row', { name: 'Destination' })).toHaveAttribute(
      'data-href',
      'https://example.test/docs',
    );
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
    let IsolatedTagGroup!: typeof TagGroup;
    let IsolatedTag!: typeof Tag;
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
      ({ TagGroup: IsolatedTagGroup, Tag: IsolatedTag } =
        jest.requireActual('./TagGroup'));
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
                <IsolatedTagGroup aria-label="Destinations">
                  <IsolatedTag id="destination" href="child">
                    Destination
                  </IsolatedTag>
                </IsolatedTagGroup>
              }
            />
          </Routes>
        </BUIProvider>
        <LocationStatus />
      </MemoryRouter>,
    );

    const tag = screen.getByRole('row', { name: 'Destination' });
    expect(tag).toHaveAttribute('data-href', '/app/catalog/entity/docs/child');
    fireEvent.click(tag);
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/docs/child',
    );
  });
});
