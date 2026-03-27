/*
 * Copyright 2024 The Backstage Authors
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
  renderInTestApp,
  TestApiRegistry,
  mockApis,
} from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';
import { identityApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef, entityRouteRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { ApiProvider } from '@backstage/core-app-api';
import { UserSettingsProfileCard } from './UserSettingsProfileCard';

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

const apiRegistry = TestApiRegistry.from(
  [identityApiRef, mockApis.identity()],
  [
    catalogApiRef,
    catalogApiMock({
      entities: [
        {
          apiVersion: 'backstage.io/v1beta1',
          kind: 'User',
          metadata: {
            name: 'test',
            annotations: {},
          },
          spec: {
            profile: {
              picture: 'https://example.com/avatar.png',
            },
          },
        },
      ],
    }),
  ],
);

describe('<UserSettingsProfileCard />', () => {
  it('displays avatar if it exists in user entity', async () => {
    const { container } = await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <UserSettingsProfileCard />
      </ApiProvider>,
      {
        mountedRoutes: { '/catalog/:namespace/:kind/:name': entityRouteRef },
      },
    );

    // Radix Avatar renders <img> only after the image load event fires.
    // The MockImage above simulates this via setTimeout, so we need to
    // wait for the image element to appear in the DOM.
    await waitFor(() => {
      const img = container.querySelector('img[alt="Profile picture"]');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.png');
    });
  });
});
