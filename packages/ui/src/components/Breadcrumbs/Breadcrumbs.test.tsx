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
import userEvent from '@testing-library/user-event';
import { BUIProvider } from '../../provider';
import {
  Breadcrumbs,
  BreadcrumbSegment,
  BreadcrumbCurrent,
} from './Breadcrumbs';

beforeAll(() => {
  global.ResizeObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })) as unknown as typeof ResizeObserver;
});

function Wrapper({ children }: PropsWithChildren) {
  return <BUIProvider>{children}</BUIProvider>;
}

describe('Breadcrumbs', () => {
  it('should render a nav with a labeled list', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbSegment href="/home">Home</BreadcrumbSegment>
        <BreadcrumbSegment href="/docs">Docs</BreadcrumbSegment>
        <BreadcrumbCurrent>Current Page</BreadcrumbCurrent>
      </Breadcrumbs>,
      { wrapper: Wrapper },
    );

    expect(screen.getByRole('navigation')).toHaveAttribute(
      'aria-label',
      'Breadcrumbs',
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Docs')).toBeInTheDocument();
    expect(screen.getByText('Current Page')).toBeInTheDocument();
  });

  it('should render segments as links and current as text', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbSegment href="/home">Home</BreadcrumbSegment>
        <BreadcrumbSegment href="/docs">Docs</BreadcrumbSegment>
        <BreadcrumbCurrent>Introduction</BreadcrumbCurrent>
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
    expect(currentItem.closest('li')).toHaveAttribute('aria-current', 'page');
  });

  it('should render separators between items but not after the last', () => {
    const { container } = render(
      <Breadcrumbs>
        <BreadcrumbSegment href="/a">First</BreadcrumbSegment>
        <BreadcrumbSegment href="/b">Second</BreadcrumbSegment>
        <BreadcrumbCurrent>Third</BreadcrumbCurrent>
      </Breadcrumbs>,
      { wrapper: Wrapper },
    );

    const separators = container.querySelectorAll('.bui-BreadcrumbSeparator');
    expect(separators).toHaveLength(2);
  });

  it('should render the current item with a custom element via as prop', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbSegment href="/home">Home</BreadcrumbSegment>
        <BreadcrumbCurrent as="h2">Page Title</BreadcrumbCurrent>
      </Breadcrumbs>,
      { wrapper: Wrapper },
    );

    const title = screen.getByText('Page Title');
    expect(title.tagName).toBe('H2');
  });

  it('should render a single current item with no separators', () => {
    const { container } = render(
      <Breadcrumbs>
        <BreadcrumbCurrent>Only Page</BreadcrumbCurrent>
      </Breadcrumbs>,
      { wrapper: Wrapper },
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('Only Page').closest('li')).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(container.querySelectorAll('.bui-BreadcrumbSeparator')).toHaveLength(
      0,
    );
  });

  it('should render a custom separator', () => {
    const { container } = render(
      <Breadcrumbs separator={<span data-testid="custom-sep">/</span>}>
        <BreadcrumbSegment href="/a">First</BreadcrumbSegment>
        <BreadcrumbCurrent>Second</BreadcrumbCurrent>
      </Breadcrumbs>,
      { wrapper: Wrapper },
    );

    expect(screen.getAllByTestId('custom-sep')).toHaveLength(1);
    expect(container.querySelectorAll('.bui-BreadcrumbSeparator')).toHaveLength(
      1,
    );
  });

  describe('collapsing', () => {
    it('should not collapse when there are 4 or fewer items', () => {
      render(
        <Breadcrumbs>
          <BreadcrumbSegment href="/a">First</BreadcrumbSegment>
          <BreadcrumbSegment href="/b">Second</BreadcrumbSegment>
          <BreadcrumbSegment href="/c">Third</BreadcrumbSegment>
          <BreadcrumbCurrent>Fourth</BreadcrumbCurrent>
        </Breadcrumbs>,
        { wrapper: Wrapper },
      );

      expect(screen.getAllByRole('listitem')).toHaveLength(4);
      expect(
        screen.queryByLabelText('Show more breadcrumbs'),
      ).not.toBeInTheDocument();
    });

    it('should collapse middle items into an ellipsis menu at 5+ items', async () => {
      const user = userEvent.setup();

      render(
        <Breadcrumbs>
          <BreadcrumbSegment href="/home">Home</BreadcrumbSegment>
          <BreadcrumbSegment href="/docs">Docs</BreadcrumbSegment>
          <BreadcrumbSegment href="/guides">Guides</BreadcrumbSegment>
          <BreadcrumbSegment href="/guides/setup">Setup</BreadcrumbSegment>
          <BreadcrumbCurrent>Introduction</BreadcrumbCurrent>
        </Breadcrumbs>,
        { wrapper: Wrapper },
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Show more breadcrumbs'),
      ).toBeInTheDocument();
      expect(screen.getByText('Setup')).toBeInTheDocument();
      expect(screen.getByText('Introduction')).toBeInTheDocument();

      expect(screen.queryByText('Docs')).not.toBeInTheDocument();
      expect(screen.queryByText('Guides')).not.toBeInTheDocument();

      await user.click(screen.getByLabelText('Show more breadcrumbs'));

      const menuItems = await screen.findAllByRole('menuitem');
      expect(menuItems).toHaveLength(2);
      expect(menuItems[0]).toHaveTextContent('Docs');
      expect(menuItems[1]).toHaveTextContent('Guides');
    });

    it('should keep the last item marked as current', () => {
      render(
        <Breadcrumbs>
          <BreadcrumbSegment href="/a">First</BreadcrumbSegment>
          <BreadcrumbSegment href="/b">Second</BreadcrumbSegment>
          <BreadcrumbSegment href="/c">Third</BreadcrumbSegment>
          <BreadcrumbSegment href="/d">Fourth</BreadcrumbSegment>
          <BreadcrumbCurrent>Fifth</BreadcrumbCurrent>
        </Breadcrumbs>,
        { wrapper: Wrapper },
      );

      expect(screen.getByText('Fifth').closest('li')).toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it('should render separators between collapsed items', () => {
      const { container } = render(
        <Breadcrumbs>
          <BreadcrumbSegment href="/a">First</BreadcrumbSegment>
          <BreadcrumbSegment href="/b">Second</BreadcrumbSegment>
          <BreadcrumbSegment href="/c">Third</BreadcrumbSegment>
          <BreadcrumbSegment href="/d">Fourth</BreadcrumbSegment>
          <BreadcrumbCurrent>Fifth</BreadcrumbCurrent>
        </Breadcrumbs>,
        { wrapper: Wrapper },
      );

      const separators = container.querySelectorAll('.bui-BreadcrumbSeparator');
      expect(separators.length).toBeGreaterThan(0);
    });
  });
});
