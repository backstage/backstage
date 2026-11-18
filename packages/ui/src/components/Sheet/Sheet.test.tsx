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

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nProvider } from 'react-aria-components';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';
import {
  Sheet,
  SheetBody,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from './Sheet';

const originalIntersectionObserver = globalThis.IntersectionObserver;
const originalResizeObserver = globalThis.ResizeObserver;
const originalMatchMedia = window.matchMedia;
const originalScrollTo = Element.prototype.scrollTo;

class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: MockIntersectionObserver,
  });
  Object.defineProperty(globalThis, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: MockResizeObserver,
  });
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
  Element.prototype.scrollTo = jest.fn();
});

afterAll(() => {
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: originalIntersectionObserver,
  });
  Object.defineProperty(globalThis, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: originalResizeObserver,
  });
  window.matchMedia = originalMatchMedia;
  Element.prototype.scrollTo = originalScrollTo;
});

describe('Sheet', () => {
  it('opens from a trigger and renders composable sections', async () => {
    render(
      <SheetTrigger>
        <Button>Open</Button>
        <Sheet position="end">
          <SheetHeader>Example Sheet</SheetHeader>
          <SheetBody>Sheet content</SheetBody>
          <SheetFooter>
            <Button slot="close">Done</Button>
          </SheetFooter>
        </Sheet>
      </SheetTrigger>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open' }));

    const dialog = await screen.findByRole('dialog', { name: 'Example Sheet' });
    expect(dialog).toHaveTextContent('Sheet content');
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
  });

  it('supports controlled open state and closes from a close slot', async () => {
    const onOpenChange = jest.fn();
    const { rerender } = render(
      <Sheet isOpen={false} onOpenChange={onOpenChange} aria-label="Details">
        <SheetBody>Sheet content</SheetBody>
      </Sheet>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(
      <Sheet isOpen onOpenChange={onOpenChange} aria-label="Details">
        <SheetBody>Sheet content</SheetBody>
        <SheetFooter>
          <Button slot="close">Done</Button>
        </SheetFooter>
      </Sheet>,
    );

    await screen.findByRole('dialog', { name: 'Details' });
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('dismisses with Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();

    render(
      <SheetTrigger>
        <Button>Open</Button>
        <Sheet position="end" aria-label="Details">
          <SheetBody>Sheet content</SheetBody>
        </Sheet>
      </SheetTrigger>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    await screen.findByRole('dialog', { name: 'Details' });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('resolves logical positions for right-to-left layouts', async () => {
    const { unmount } = render(
      <I18nProvider locale="ar-AE">
        <Sheet defaultOpen position="start" aria-label="Navigation">
          <SheetBody>Sheet content</SheetBody>
        </Sheet>
      </I18nProvider>,
    );

    let dialog = await screen.findByRole('dialog', { name: 'Navigation' });
    expect(dialog.closest('[data-position]')).toHaveAttribute(
      'data-position',
      'right',
    );

    unmount();

    render(
      <I18nProvider locale="ar-AE">
        <Sheet defaultOpen position="end" aria-label="Navigation">
          <SheetBody>Sheet content</SheetBody>
        </Sheet>
      </I18nProvider>,
    );

    dialog = await screen.findByRole('dialog', { name: 'Navigation' });
    expect(dialog.closest('[data-position]')).toHaveAttribute(
      'data-position',
      'left',
    );
  });

  it('applies className and dimensions to the sheet panel', async () => {
    render(
      <Sheet
        defaultOpen
        className="custom-sheet"
        width={480}
        height="60vh"
        aria-label="Details"
      >
        <SheetBody>Sheet content</SheetBody>
      </Sheet>,
    );

    const dialog = await screen.findByRole('dialog', { name: 'Details' });
    const panel = dialog.closest('.custom-sheet');
    expect(panel).toHaveAttribute('data-position', 'bottom');
    expect(panel).toHaveStyle('--bui-sheet-width: 480px');
    expect(panel).toHaveStyle('--bui-sheet-height: 60vh');
  });
});
