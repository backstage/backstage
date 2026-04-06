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

import { vi } from 'vitest';

import {
  PageBlueprint,
  createFrontendPlugin,
} from '@backstage/frontend-plugin-api';
import { waitFor, within } from '@testing-library/react';
import { createDevApp } from './createDevApp';

vi.setConfig({ testTimeout: 15000 });

const originalEnv = process.env;

async function loadCreateDevAppIsolated(): Promise<
  typeof import('./createDevApp').createDevApp
> {
  const { createDevApp: isolatedCreateDevApp } = await import('./createDevApp');
  return isolatedCreateDevApp;
}

describe('createDevApp', () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.resetAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should render a dev app with a plugin', async () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    const testPlugin = createFrontendPlugin({
      pluginId: 'test',
      extensions: [
        PageBlueprint.make({
          params: {
            path: '/',
            loader: async () => <div>Test Plugin Page</div>,
          },
        }),
      ],
    });

    (process.env as any).APP_CONFIG = [
      {
        context: 'test',
        data: {
          app: { title: 'Test App' },
          backend: { baseUrl: 'http://localhost' },
        },
      },
    ];

    createDevApp({
      features: [testPlugin],
    });

    const body = within(document.body);
    await body.findByText('Test Plugin Page', {}, { timeout: 10000 });
  });

  it('should forward bindRoutes to createApp', async () => {
    vi.resetModules();

    const bindRoutes = vi.fn();
    const createApp = vi.fn(() => ({
      createRoot: () => <div>Test App Root</div>,
    }));
    const render = vi.fn();
    const createRoot = vi.fn(() => ({ render }));

    vi.doMock('@backstage/frontend-defaults', () => ({
      createApp,
    }));
    vi.doMock('@backstage/plugin-app', () => ({
      __esModule: true,
      default: {
        withOverrides: vi.fn(() => 'app-plugin-override'),
        getExtension: vi.fn(() => ({
          override: vi.fn(() => 'disabled-sign-in-page'),
        })),
      },
    }));
    vi.doMock('react-dom/client', () => ({
      __esModule: true,
      createRoot,
    }));

    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    const isolatedCreateDevApp = await loadCreateDevAppIsolated();
    isolatedCreateDevApp({
      bindRoutes,
      features: ['plugin-feature'] as any,
    });

    await waitFor(() => {
      expect(createApp).toHaveBeenCalledWith({
        bindRoutes,
        features: ['app-plugin-override', 'plugin-feature'],
      });
      expect(createRoot).toHaveBeenCalledWith(root);
    });

    const renderedNode = render.mock.calls[0][0] as any;
    expect(renderedNode.props.children).toHaveLength(2);
    expect(renderedNode.props.children[0].props.fallback).toBeNull();
    expect(renderedNode.props.children[1].props.children).toBe('Test App Root');
  });

  it('should throw a clear error when the root element is missing', () => {
    expect(() => createDevApp({ features: [] })).toThrow(
      "Could not find the dev app root element '#root'; make sure your dev entry HTML contains a root element with that id.",
    );
  });

  it('should fall back to legacy react-dom rendering when createRoot is unavailable', async () => {
    vi.resetModules();
    delete process.env.HAS_REACT_DOM_CLIENT;

    const createApp = vi.fn(() => ({
      createRoot: () => <div>Test App Root</div>,
    }));
    const render = vi.fn();

    vi.doMock('@backstage/frontend-defaults', () => ({
      createApp,
    }));
    vi.doMock('@backstage/plugin-app', () => ({
      __esModule: true,
      default: {
        withOverrides: vi.fn(() => 'app-plugin-override'),
        getExtension: vi.fn(() => ({
          override: vi.fn(() => 'disabled-sign-in-page'),
        })),
      },
    }));
    vi.doMock('react-dom', () => ({
      __esModule: true,
      render,
    }));

    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    const isolatedCreateDevApp = await loadCreateDevAppIsolated();
    isolatedCreateDevApp({
      features: ['plugin-feature'] as any,
    });

    await waitFor(() => {
      expect(render).toHaveBeenCalled();
      expect(createApp).toHaveBeenCalledWith({
        bindRoutes: undefined,
        features: ['app-plugin-override', 'plugin-feature'],
      });
    });
  });
});
