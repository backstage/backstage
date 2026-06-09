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
import { MemoryRouter } from 'react-router-dom';
import { BUIProvider } from '../../provider';
import { PluginHeader } from './PluginHeader';

const originalWarn = console.warn.bind(console);
const originalResizeObserver = global.ResizeObserver;

beforeAll(() => {
  global.ResizeObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })) as unknown as typeof ResizeObserver;

  jest.spyOn(console, 'warn').mockImplementation((msg: unknown, ...args) => {
    if (typeof msg === 'string' && msg.includes('<Focusable>')) return;
    originalWarn(msg, ...args);
  });
});

afterAll(() => {
  global.ResizeObserver = originalResizeObserver;
  jest.restoreAllMocks();
});

function Wrapper({ children }: PropsWithChildren) {
  return (
    <MemoryRouter>
      <BUIProvider>{children}</BUIProvider>
    </MemoryRouter>
  );
}

describe('PluginHeader', () => {
  it('should render the title as a breadcrumb when no breadcrumbs are provided', () => {
    render(<PluginHeader title="My Plugin" />, { wrapper: Wrapper });

    expect(screen.getByText('My Plugin')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('should render a default title when no title is provided', () => {
    render(<PluginHeader />, { wrapper: Wrapper });

    expect(screen.getByText('Your plugin')).toBeInTheDocument();
  });

  it('should render breadcrumbs instead of the title when provided', () => {
    const breadcrumbs = [
      { label: 'Home', href: '/home' },
      { label: 'Settings', href: '/settings' },
    ];

    render(<PluginHeader title="My Plugin" breadcrumbs={breadcrumbs} />, {
      wrapper: Wrapper,
    });

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Home');
    expect(items[1]).toHaveTextContent('Settings');
    expect(screen.queryByText('My Plugin')).not.toBeInTheDocument();
  });

  it('should fall back to title when breadcrumbs array is empty', () => {
    render(<PluginHeader title="My Plugin" breadcrumbs={[]} />, {
      wrapper: Wrapper,
    });

    expect(screen.getByText('My Plugin')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('should render tabs when provided', () => {
    const tabs = [
      { id: 'overview', label: 'Overview', href: '/overview' },
      { id: 'settings', label: 'Settings', href: '/settings' },
    ];

    render(<PluginHeader title="My Plugin" tabs={tabs} />, {
      wrapper: Wrapper,
    });

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render custom actions', () => {
    render(
      <PluginHeader
        title="My Plugin"
        customActions={<button>Action</button>}
      />,
      { wrapper: Wrapper },
    );

    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});
