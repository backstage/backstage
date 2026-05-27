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

import { type PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import { BUIProvider } from '../../provider';
import { Breadcrumbs, Breadcrumb } from './Breadcrumbs';

function Wrapper({ children }: PropsWithChildren) {
  return <BUIProvider>{children}</BUIProvider>;
}

describe('Breadcrumbs', () => {
  it('should render a labeled list with all breadcrumb items', () => {
    render(
      <Breadcrumbs>
        <Breadcrumb href="/home">Home</Breadcrumb>
        <Breadcrumb href="/docs">Docs</Breadcrumb>
        <Breadcrumb href="/docs/current">Current Page</Breadcrumb>
      </Breadcrumbs>,
      { wrapper: Wrapper },
    );

    expect(screen.getByRole('list')).toHaveAttribute(
      'aria-label',
      'Breadcrumbs',
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Docs')).toBeInTheDocument();
    expect(screen.getByText('Current Page')).toBeInTheDocument();
  });

  it('should render links for non-current items and plain text for the last item', () => {
    render(
      <Breadcrumbs>
        <Breadcrumb href="/home">Home</Breadcrumb>
        <Breadcrumb href="/docs">Docs</Breadcrumb>
        <Breadcrumb href="/docs/intro">Introduction</Breadcrumb>
      </Breadcrumbs>,
      { wrapper: Wrapper },
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent('Home');
    expect(links[0]).toHaveAttribute('href', '/home');
    expect(links[1]).toHaveTextContent('Docs');
    expect(links[1]).toHaveAttribute('href', '/docs');

    const currentItem = screen.getByText('Introduction');
    expect(currentItem.tagName).toBe('SPAN');
    expect(currentItem.closest('li')).toHaveAttribute('data-current', 'true');
  });

  it('should render separators between items but not after the last one', () => {
    const { container } = render(
      <Breadcrumbs>
        <Breadcrumb href="/a">First</Breadcrumb>
        <Breadcrumb href="/b">Second</Breadcrumb>
        <Breadcrumb href="/c">Third</Breadcrumb>
      </Breadcrumbs>,
      { wrapper: Wrapper },
    );

    const items = screen.getAllByRole('listitem');
    const separators = container.querySelectorAll('.bui-BreadcrumbSeparator');
    expect(separators).toHaveLength(items.length - 1);

    expect(items[0].querySelector('.bui-BreadcrumbSeparator')).not.toBeNull();
    expect(items[1].querySelector('.bui-BreadcrumbSeparator')).not.toBeNull();
    expect(items[2].querySelector('.bui-BreadcrumbSeparator')).toBeNull();
  });

  it('should render a breadcrumb without href as a span even when not current', () => {
    render(
      <Breadcrumbs>
        <Breadcrumb href="/home">Home</Breadcrumb>
        <Breadcrumb>No Link</Breadcrumb>
        <Breadcrumb href="/current">Current</Breadcrumb>
      </Breadcrumbs>,
      { wrapper: Wrapper },
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveTextContent('Home');

    expect(screen.getByText('No Link').tagName).toBe('SPAN');
  });

  it('should render a single breadcrumb as current with no separators', () => {
    const { container } = render(
      <Breadcrumbs>
        <Breadcrumb href="only-page">Only Page</Breadcrumb>
      </Breadcrumbs>,
      { wrapper: Wrapper },
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('Only Page').closest('li')).toHaveAttribute(
      'data-current',
      'true',
    );
    expect(container.querySelectorAll('.bui-BreadcrumbSeparator')).toHaveLength(
      0,
    );
  });
});
