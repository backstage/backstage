/*
 * Copyright 2025 The Backstage Authors
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

import { vi, type MockInstance, type Mock } from 'vitest';

import { render } from '@testing-library/react';
import { TechDocsLiveReload, utils } from './LiveReloadAddon';

vi.mock('@backstage/plugin-techdocs-react', () => ({
  useShadowRootElements: vi.fn(() => [
    {
      querySelector: vi.fn((selector: string) => {
        if (selector === 'live-reload') {
          return {
            getAttribute: (name: string) => {
              if (name === 'live-reload-epoch') return '10';
              if (name === 'live-reload-request-id') return '1';
              return null;
            },
          };
        }
        return null;
      }),
    },
  ]),
}));

describe('TechDocsLiveReload', () => {
  const originalXHR = global.XMLHttpRequest;
  let openSpy: Mock;
  let sendSpy: Mock;
  let reloadPageSpy: MockInstance;

  beforeEach(() => {
    openSpy = vi.fn();
    sendSpy = vi.fn(function (this: any) {
      // simulate long-poll response that does NOT trigger reload (epoch unchanged)
      setTimeout(() => {
        (this as any).status = 200;
        (this as any).responseText = '10';
        (this as any).onloadend?.call(this);
      }, 0);
    });

    class MockXHR {
      onloadend: ((this: any) => void) | null = null;
      status = 0;
      responseText = '';
      open = openSpy;
      send = sendSpy as any;
      abort = vi.fn();
    }

    global.XMLHttpRequest = MockXHR as any;

    // Spy on the utils object's reloadPage method
    reloadPageSpy = vi.spyOn(utils, 'reloadPage').mockImplementation(() => {});

    vi.spyOn(window, 'addEventListener').mockImplementation(() => undefined);
    vi.spyOn(window, 'removeEventListener').mockImplementation(() => undefined);
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      configurable: true,
    });
  });

  afterEach(() => {
    global.XMLHttpRequest = originalXHR;
    vi.restoreAllMocks();
  });

  it('polls livereload endpoint and does not reload when epoch unchanged', async () => {
    render(<TechDocsLiveReload enabled />);
    expect(openSpy).toHaveBeenCalledWith('GET', '/.livereload/10/1');
    // give microtask queue a tick
    await new Promise(res => setTimeout(res, 0));
    expect(reloadPageSpy).not.toHaveBeenCalled();
  });

  it('reloads when server epoch increases', async () => {
    sendSpy.mockImplementation(function (this: any) {
      setTimeout(() => {
        (this as any).status = 200;
        (this as any).responseText = '11';
        (this as any).onloadend?.call(this);
      }, 0);
    });

    render(<TechDocsLiveReload enabled />);
    await new Promise(res => setTimeout(res, 0));
    expect(reloadPageSpy).toHaveBeenCalled();
  });
});
