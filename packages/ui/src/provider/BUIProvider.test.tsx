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

import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line no-restricted-imports
import { useRouter } from 'react-aria/private/utils/openLink';
import { MemoryRouter } from 'react-router-dom';
import { BUIProvider } from './BUIProvider';
import type { BUIRouter } from './BUIRouter';
import { Link } from '../components/Link';

function createRouter(overrides: Partial<BUIRouter> = {}): BUIRouter {
  return {
    navigate: jest.fn(),
    useHref: href => href,
    useLocation: () => ({ pathname: '/', search: '', hash: '' }),
    ...overrides,
  };
}

describe('BUIProvider', () => {
  it('routes descendant link clicks through a provided navigate function instead of react-router', () => {
    const navigate = jest.fn();

    render(
      <BUIProvider router={createRouter({ navigate })}>
        <Link href="/catalog/default/component/widget">Widget</Link>
      </BUIProvider>,
    );

    const link = screen.getByRole('link', { name: 'Widget' });
    // No react-router context is required when `navigate` is provided.
    expect(link).toHaveAttribute('href', '/catalog/default/component/widget');

    fireEvent.click(link);

    expect(navigate).toHaveBeenCalledWith(
      '/catalog/default/component/widget',
      undefined,
    );
  });

  it('exposes a provided useHref function via the react-aria router context', () => {
    const navigate = jest.fn();
    const useHref = (href: string) => `/base${href}`;
    let captured: ReturnType<typeof useRouter> | undefined;

    function RouterProbe() {
      captured = useRouter();
      return null;
    }

    render(
      <BUIProvider router={createRouter({ navigate, useHref })}>
        <RouterProbe />
      </BUIProvider>,
    );

    expect(captured?.isNative).toBe(false);
    expect(captured?.useHref('/widget')).toBe('/base/widget');
  });

  it('adapts ambient react-router navigation when router is not provided', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <BUIProvider>
          <Link href="/catalog">Catalog</Link>
        </BUIProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute(
      'href',
      '/catalog',
    );
  });

  it('renders without any routing authority', () => {
    render(
      <BUIProvider>
        <Link href="/catalog">Catalog</Link>
      </BUIProvider>,
    );

    expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute(
      'href',
      '/catalog',
    );
  });

  it.each([
    ['a new browsing context', { target: '_blank' }],
    ['a named browsing context', { target: 'documentation' }],
    ['a download', { download: 'catalog.json' }],
  ])('leaves %s to the browser', (_description, linkProps) => {
    const navigate = jest.fn();

    render(
      <BUIProvider router={createRouter({ navigate })}>
        <Link href="/catalog" {...linkProps}>
          Catalog
        </Link>
      </BUIProvider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Catalog' }));

    expect(navigate).not.toHaveBeenCalled();
  });
});
