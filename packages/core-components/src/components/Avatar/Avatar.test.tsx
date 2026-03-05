/*
 * Copyright 2020 The Backstage Authors
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

import { render, screen, waitFor } from '@testing-library/react';
import { Avatar } from './Avatar';

/**
 * Radix Avatar uses `new Image()` with `addEventListener('load', ...)` to
 * detect image load status. In jsdom, Image objects don't fire load events,
 * so AvatarImage never transitions to the "loaded" state and the `<img>`
 * element is not rendered. This mock simulates successful image loading.
 */
const OriginalImage = window.Image;

beforeAll(() => {
  (window as any).Image = class MockImage {
    _src = '';
    naturalWidth = 100;
    naturalHeight = 100;
    _listeners: Record<string, Array<() => void>> = {};

    addEventListener(event: string, handler: () => void) {
      if (!this._listeners[event]) {
        this._listeners[event] = [];
      }
      this._listeners[event].push(handler);
    }

    removeEventListener(event: string, handler: () => void) {
      if (this._listeners[event]) {
        this._listeners[event] = this._listeners[event].filter(
          h => h !== handler,
        );
      }
    }

    get src() {
      return this._src;
    }

    set src(value: string) {
      this._src = value;
      // Simulate successful image load on the next microtask
      setTimeout(() => {
        this._listeners.load?.forEach(h => h());
      }, 0);
    }
  };
});

afterAll(() => {
  window.Image = OriginalImage;
});

describe('<Avatar />', () => {
  it('renders initials from displayName', () => {
    render(<Avatar displayName="John Doe" />);

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders an img element when picture is provided', async () => {
    const { container } = render(
      <Avatar displayName="John Doe" picture="https://example.com/photo.jpg" />,
    );

    await waitFor(() => {
      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
    });
  });

  it('renders without crashing when no props are provided', () => {
    const { container } = render(<Avatar />);

    expect(container.firstChild).toBeTruthy();
  });

  it('provides alt text for accessibility when displayName is set', async () => {
    const { container } = render(
      <Avatar displayName="John Doe" picture="https://example.com/photo.jpg" />,
    );

    await waitFor(() => {
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'John Doe');
    });
  });
});
