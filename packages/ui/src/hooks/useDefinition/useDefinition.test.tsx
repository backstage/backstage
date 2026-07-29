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
import { type PropsWithChildren, type ReactNode } from 'react';
import { renderHook, render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useDefinition } from './useDefinition';
import type { ComponentConfig } from './types';
import { BgProvider, useBgConsumer } from '../useBg';
import { noopTracker } from '../../analytics/useAnalytics';
import { BUIProvider } from '../../provider';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function BgReader() {
  const { bg } = useBgConsumer();
  return <span data-testid="bg">{bg ?? 'none'}</span>;
}

function Wrapper({ children }: PropsWithChildren) {
  return <BUIProvider>{children}</BUIProvider>;
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const basicDef = {
  styles: { root: 'css-root' },
  classNames: { root: 'root' },
  propDefs: {
    variant: { dataAttribute: true } as const,
    size: { dataAttribute: true, default: 'medium' } as const,
    className: {},
  },
} as const satisfies ComponentConfig<any, any>;

const multiSlotDef = {
  styles: { root: 'css-root', content: 'css-content' },
  classNames: { root: 'root', content: 'content' },
  propDefs: {
    variant: { dataAttribute: true } as const,
    className: {},
  },
  utilityProps: ['m'] as const,
} as const satisfies ComponentConfig<any, any>;

const utilityDef = {
  styles: { root: 'css-root' },
  classNames: { root: 'root' },
  propDefs: {
    variant: {},
    className: {},
  },
  utilityProps: ['m', 'p', 'width'] as const,
} as const satisfies ComponentConfig<any, any>;

const providerDef = {
  styles: { root: 'css-root' },
  classNames: { root: 'root' },
  propDefs: {
    bg: { dataAttribute: true } as const,
    children: {},
    className: {},
  },
  bg: 'provider' as const,
} as const satisfies ComponentConfig<any, any>;

const consumerDef = {
  styles: { root: 'css-root' },
  classNames: { root: 'root' },
  propDefs: {
    variant: {},
    className: {},
  },
  bg: 'consumer' as const,
} as const satisfies ComponentConfig<any, any>;

const analyticsDef = {
  styles: { root: 'css-root' },
  classNames: { root: 'root' },
  propDefs: {
    noTrack: {},
    className: {},
  },
  analytics: true,
} as const satisfies ComponentConfig<any, any>;

const hrefDef = {
  styles: { root: 'css-root' },
  classNames: { root: 'root' },
  propDefs: {
    href: {},
    className: {},
  },
} as const satisfies ComponentConfig<any, any>;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

function createRouterWrapper({
  basename,
  currentRoute,
}: {
  basename?: string;
  currentRoute: string;
}) {
  return function RouterWrapper({ children }: PropsWithChildren) {
    const entry = basename ? `${basename}${currentRoute}` : currentRoute;
    // Build nested Routes one level per path segment. The leaf route uses a
    // non-splat path so that `..` resolution works correctly.
    const segments =
      currentRoute === '/'
        ? []
        : currentRoute.replace(/^\//, '').split('/').filter(Boolean);

    const buildRoutes = (segs: string[], el: ReactNode): ReactNode => {
      if (segs.length === 0) return <Route index element={el} />;
      const [head, ...tail] = segs;
      if (tail.length === 0) {
        return <Route path={head} element={el} />;
      }
      return <Route path={`${head}/*`}>{buildRoutes(tail, el)}</Route>;
    };

    return (
      <MemoryRouter basename={basename} initialEntries={[entry]}>
        <BUIProvider>
          <Routes>
            {segments.length === 0 ? (
              <Route path="*" element={children} />
            ) : (
              buildRoutes(segments, children)
            )}
          </Routes>
        </BUIProvider>
      </MemoryRouter>
    );
  };
}

describe('useDefinition', () => {
  describe('prop resolution', () => {
    it('returns resolved own props from propDefs', () => {
      const { result } = renderHook(
        () => useDefinition(basicDef, { variant: 'primary' }),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps.variant).toBe('primary');
    });

    it('applies default values for missing own props', () => {
      const { result } = renderHook(
        () => useDefinition(basicDef, { variant: 'primary' }),
        { wrapper: Wrapper },
      );

      expect((result.current.ownProps as any).size).toBe('medium');
    });

    it('returns rest props for props not in propDefs or utilityProps', () => {
      const { result } = renderHook(
        () =>
          useDefinition(basicDef, {
            variant: 'primary',
            'aria-label': 'test',
          }),
        { wrapper: Wrapper },
      );

      expect(result.current.restProps).toEqual({ 'aria-label': 'test' });
    });

    it('excludes utility props from both ownProps and restProps', () => {
      const { result } = renderHook(
        () =>
          useDefinition(utilityDef, {
            variant: 'primary',
            m: '2',
            'aria-label': 'test',
          }),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps).not.toHaveProperty('m');
      expect(result.current.restProps).not.toHaveProperty('m');
      expect(result.current.restProps).toEqual({ 'aria-label': 'test' });
    });
  });

  describe('classes', () => {
    it('builds a classes object with keys matching definition.classNames', () => {
      const { result } = renderHook(
        () => useDefinition(multiSlotDef, { variant: 'primary' }),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps.classes).toHaveProperty('root');
      expect(result.current.ownProps.classes).toHaveProperty('content');
    });

    it('includes the base CSS class from definition.styles', () => {
      const { result } = renderHook(
        () => useDefinition(basicDef, { variant: 'primary' }),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps.classes.root).toContain('css-root');
    });

    it('appends user className to the root slot by default', () => {
      const { result } = renderHook(
        () =>
          useDefinition(basicDef, {
            variant: 'primary',
            className: 'custom',
          }),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps.classes.root).toContain('custom');
    });

    it('appends utility classes to the root slot by default', () => {
      const { result } = renderHook(
        () => useDefinition(utilityDef, { variant: 'primary', m: '2' }),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps.classes.root).toContain('bui-m-2');
    });

    it('appends user className to a custom classNameTarget slot', () => {
      const { result } = renderHook(
        () =>
          useDefinition(
            multiSlotDef,
            { variant: 'primary', className: 'custom' },
            {
              classNameTarget: 'content',
            },
          ),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps.classes.content).toContain('custom');
      expect(result.current.ownProps.classes.root).not.toContain('custom');
    });

    it('appends utility classes to a custom utilityTarget slot', () => {
      const { result } = renderHook(
        () =>
          useDefinition(
            multiSlotDef,
            { variant: 'primary', m: '2' },
            {
              utilityTarget: 'content',
            },
          ),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps.classes.content).toContain('bui-m-2');
      expect(result.current.ownProps.classes.root).not.toContain('bui-m-2');
    });

    it('does not append user className when classNameTarget is null', () => {
      const { result } = renderHook(
        () =>
          useDefinition(
            basicDef,
            { variant: 'primary', className: 'custom' },
            {
              classNameTarget: null,
            },
          ),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps.classes.root).not.toContain('custom');
    });

    it('does not append utility classes when utilityTarget is null', () => {
      const { result } = renderHook(
        () =>
          useDefinition(
            utilityDef,
            { variant: 'primary', m: '2' },
            {
              utilityTarget: null,
            },
          ),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps.classes.root).not.toContain('bui-m-2');
    });

    it('keeps non-targeted slots free of utility classes and user className', () => {
      const { result } = renderHook(
        () =>
          useDefinition(multiSlotDef, {
            variant: 'primary',
            m: '2',
            className: 'custom',
          }),
        { wrapper: Wrapper },
      );

      // Defaults target root — content should be clean
      expect(result.current.ownProps.classes.content).not.toContain('bui-m-2');
      expect(result.current.ownProps.classes.content).not.toContain('custom');
    });
  });

  describe('data attributes', () => {
    it('generates data-* attributes for props with dataAttribute: true', () => {
      const { result } = renderHook(
        () => useDefinition(basicDef, { variant: 'primary' }),
        { wrapper: Wrapper },
      );

      expect(result.current.dataAttributes['data-variant']).toBe('primary');
    });

    it('does not generate data-* for props without dataAttribute', () => {
      const { result } = renderHook(
        () =>
          useDefinition(basicDef, {
            variant: 'primary',
            className: 'custom',
          }),
        { wrapper: Wrapper },
      );

      expect(result.current.dataAttributes).not.toHaveProperty(
        'data-classname',
      );
    });

    it('omits data-* when the prop value is undefined', () => {
      const { result } = renderHook(() => useDefinition(basicDef, {}), {
        wrapper: Wrapper,
      });

      expect(result.current.dataAttributes).not.toHaveProperty('data-variant');
    });

    it('stringifies non-string prop values in data attributes', () => {
      const numericDef = {
        styles: { root: 'css-root' },
        classNames: { root: 'root' },
        propDefs: {
          count: { dataAttribute: true } as const,
          className: {},
        },
      } as const satisfies ComponentConfig<any, any>;

      const { result } = renderHook(
        () => useDefinition(numericDef, { count: 42 }),
        { wrapper: Wrapper },
      );

      expect(result.current.dataAttributes['data-count']).toBe('42');
    });

    it('does not generate data-bg from propDefs when bg=provider (uses provider path instead)', () => {
      const localProviderDef = {
        styles: { root: 'css-root' },
        classNames: { root: 'root' },
        propDefs: {
          bg: { dataAttribute: true } as const,
          children: {},
          className: {},
        },
        bg: 'provider' as const,
      } as const satisfies ComponentConfig<any, any>;

      const { result } = renderHook(
        () =>
          useDefinition(localProviderDef, {
            bg: 'danger',
            children: null,
          }),
        { wrapper: Wrapper },
      );

      // data-bg comes from the provider resolution path, not the propDef
      expect(result.current.dataAttributes['data-bg']).toBe('danger');
    });
  });

  describe('bg: provider', () => {
    it('sets data-bg from the resolved provider bg value', () => {
      const { result } = renderHook(
        () =>
          useDefinition(providerDef, {
            bg: 'danger',
            children: null,
          }),
        { wrapper: Wrapper },
      );

      expect(result.current.dataAttributes['data-bg']).toBe('danger');
    });

    it('does not set data-bg when bg prop is undefined', () => {
      const { result } = renderHook(
        () =>
          useDefinition(providerDef, {
            children: null,
          }),
        { wrapper: Wrapper },
      );

      expect(result.current.dataAttributes).not.toHaveProperty('data-bg');
    });

    it('adds childrenWithBgProvider to ownProps', () => {
      const { result } = renderHook(
        () =>
          useDefinition(providerDef, {
            bg: 'neutral',
            children: 'hello',
          }),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps).toHaveProperty('childrenWithBgProvider');
    });

    it('wraps children in BgProvider when bg resolves to a value', () => {
      const { result } = renderHook(
        () =>
          useDefinition(providerDef, {
            bg: 'neutral',
            children: <BgReader />,
          }),
        { wrapper: Wrapper },
      );

      const { getByTestId } = render(
        <>{result.current.ownProps.childrenWithBgProvider}</>,
      );

      expect(getByTestId('bg')).toHaveTextContent('neutral-1');
    });

    it('returns raw children as childrenWithBgProvider when bg is undefined', () => {
      const childContent = <span>hello</span>;
      const { result } = renderHook(
        () =>
          useDefinition(providerDef, {
            children: childContent,
          }),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps.childrenWithBgProvider).toBe(childContent);
    });

    it('increments neutral bg level from parent context', () => {
      const wrapper = ({ children }: PropsWithChildren) => (
        <BUIProvider>
          <BgProvider bg="neutral-1">{children}</BgProvider>
        </BUIProvider>
      );

      const { result } = renderHook(
        () =>
          useDefinition(providerDef, {
            bg: 'neutral',
            children: <BgReader />,
          }),
        { wrapper },
      );

      expect(result.current.dataAttributes['data-bg']).toBe('neutral-2');
    });
  });

  describe('bg: consumer', () => {
    it('sets data-on-bg from parent BgProvider context', () => {
      const wrapper = ({ children }: PropsWithChildren) => (
        <BUIProvider>
          <BgProvider bg="neutral-1">{children}</BgProvider>
        </BUIProvider>
      );

      const { result } = renderHook(
        () => useDefinition(consumerDef, { variant: 'primary' }),
        { wrapper },
      );

      expect(result.current.dataAttributes['data-on-bg']).toBe('neutral-1');
    });

    it('does not set data-on-bg when no parent BgProvider exists', () => {
      const { result } = renderHook(
        () => useDefinition(consumerDef, { variant: 'primary' }),
        { wrapper: Wrapper },
      );

      expect(result.current.dataAttributes).not.toHaveProperty('data-on-bg');
    });

    it('returns children (not childrenWithBgProvider) in ownProps', () => {
      const { result } = renderHook(
        () =>
          useDefinition(consumerDef, { variant: 'primary', children: 'hello' }),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps).toHaveProperty('children', 'hello');
      expect(result.current.ownProps).not.toHaveProperty(
        'childrenWithBgProvider',
      );
    });
  });

  describe('no bg config', () => {
    it('does not set data-bg or data-on-bg', () => {
      const { result } = renderHook(
        () => useDefinition(basicDef, { variant: 'primary' }),
        { wrapper: Wrapper },
      );

      expect(result.current.dataAttributes).not.toHaveProperty('data-bg');
      expect(result.current.dataAttributes).not.toHaveProperty('data-on-bg');
    });

    it('returns children in ownProps', () => {
      const { result } = renderHook(
        () =>
          useDefinition(basicDef, { variant: 'primary', children: 'hello' }),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps).toHaveProperty('children', 'hello');
    });
  });

  describe('utility style', () => {
    it('returns utilityStyle with CSS custom properties from utility props', () => {
      const { result } = renderHook(
        () =>
          useDefinition(utilityDef, {
            variant: 'primary',
            width: '100px',
          }),
        { wrapper: Wrapper },
      );

      expect(result.current.utilityStyle).toEqual({ '--width': '100px' });
    });

    it('returns empty utilityStyle when no utility props are provided', () => {
      const { result } = renderHook(
        () => useDefinition(utilityDef, { variant: 'primary' }),
        { wrapper: Wrapper },
      );

      expect(result.current.utilityStyle).toEqual({});
    });
  });

  describe('analytics', () => {
    it('returns analytics tracker when definition.analytics is true', () => {
      const { result } = renderHook(() => useDefinition(analyticsDef, {}), {
        wrapper: Wrapper,
      });

      expect(result.current).toHaveProperty('analytics');
      expect(result.current.analytics).toHaveProperty('captureEvent');
    });

    it('does not include analytics key when definition.analytics is not set', () => {
      const { result } = renderHook(
        () => useDefinition(basicDef, { variant: 'primary' }),
        { wrapper: Wrapper },
      );

      expect(result.current).not.toHaveProperty('analytics');
    });

    it('returns noopTracker when noTrack is true', () => {
      const { result } = renderHook(
        () => useDefinition(analyticsDef, { noTrack: true }),
        { wrapper: Wrapper },
      );

      expect(result.current.analytics).toBe(noopTracker);
    });
  });

  describe('href resolution', () => {
    describe('inside router context', () => {
      describe.each([
        ['no basename', undefined],
        ['with basename /app', '/app'],
      ] as const)('%s', (_label, basename) => {
        it.each`
          description                       | href                  | currentRoute        | expected
          ${'absolute path'}                | ${'/foo'}             | ${'/catalog'}       | ${'/foo'}
          ${'root /'}                       | ${'/'}                | ${'/catalog'}       | ${'/'}
          ${'relative path "foo"'}          | ${'foo'}              | ${'/catalog'}       | ${'/catalog/foo'}
          ${'relative path "./foo"'}        | ${'./foo'}            | ${'/catalog'}       | ${'/catalog/foo'}
          ${'relative path "../foo"'}       | ${'../foo'}           | ${'/catalog/items'} | ${'/catalog/foo'}
          ${'empty string'}                 | ${''}                 | ${'/catalog'}       | ${'/catalog'}
          ${'absolute with query params'}   | ${'/foo?q=1'}         | ${'/catalog'}       | ${'/foo?q=1'}
          ${'absolute with hash'}           | ${'/foo#section'}     | ${'/catalog'}       | ${'/foo#section'}
          ${'absolute with query and hash'} | ${'/foo?q=1#section'} | ${'/catalog'}       | ${'/foo?q=1#section'}
          ${'relative with query params'}   | ${'foo?q=1'}          | ${'/catalog'}       | ${'/catalog/foo?q=1'}
        `(
          'resolves $description — returns $expected',
          ({
            href,
            currentRoute,
            expected,
          }: {
            href: string;
            currentRoute: string;
            expected: string;
          }) => {
            const { result } = renderHook(
              () => useDefinition(hrefDef, { href }),
              {
                wrapper: createRouterWrapper({ basename, currentRoute }),
              },
            );

            expect(result.current.ownProps.href).toBe(expected);
          },
        );

        it.each`
          description                | href
          ${'https:// URL'}          | ${'https://example.com'}
          ${'http:// URL'}           | ${'http://example.com'}
          ${'mailto: link'}          | ${'mailto:a@b.com'}
          ${'tel: link'}             | ${'tel:123'}
          ${'protocol-relative URL'} | ${'//example.com'}
        `('leaves $description unchanged', ({ href }: { href: string }) => {
          const { result } = renderHook(
            () => useDefinition(hrefDef, { href }),
            {
              wrapper: createRouterWrapper({
                basename,
                currentRoute: '/catalog',
              }),
            },
          );

          expect(result.current.ownProps.href).toBe(href);
        });

        it('does not modify props when href is undefined', () => {
          const { result } = renderHook(() => useDefinition(hrefDef, {}), {
            wrapper: createRouterWrapper({
              basename,
              currentRoute: '/catalog',
            }),
          });

          expect(result.current.ownProps).not.toHaveProperty('href');
        });
      });
    });

    describe('outside router context', () => {
      it('passes all href values through unchanged', () => {
        const { result } = renderHook(
          () => useDefinition(hrefDef, { href: '/foo' }),
          { wrapper: Wrapper },
        );

        expect(result.current.ownProps.href).toBe('/foo');
      });
    });
  });

  describe('options', () => {
    it('utilityTarget defaults to root', () => {
      const { result } = renderHook(
        () => useDefinition(multiSlotDef, { variant: 'primary', m: '2' }),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps.classes.root).toContain('bui-m-2');
      expect(result.current.ownProps.classes.content).not.toContain('bui-m-2');
    });

    it('classNameTarget defaults to root', () => {
      const { result } = renderHook(
        () =>
          useDefinition(multiSlotDef, {
            variant: 'primary',
            className: 'custom',
          }),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps.classes.root).toContain('custom');
      expect(result.current.ownProps.classes.content).not.toContain('custom');
    });

    it('custom utilityTarget applies utility classes to that slot', () => {
      const { result } = renderHook(
        () =>
          useDefinition(
            multiSlotDef,
            { variant: 'primary', m: '2' },
            { utilityTarget: 'content' },
          ),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps.classes.content).toContain('bui-m-2');
      expect(result.current.ownProps.classes.root).not.toContain('bui-m-2');
    });

    it('custom classNameTarget applies className to that slot', () => {
      const { result } = renderHook(
        () =>
          useDefinition(
            multiSlotDef,
            { variant: 'primary', className: 'custom' },
            { classNameTarget: 'content' },
          ),
        { wrapper: Wrapper },
      );

      expect(result.current.ownProps.classes.content).toContain('custom');
      expect(result.current.ownProps.classes.root).not.toContain('custom');
    });
  });
});
