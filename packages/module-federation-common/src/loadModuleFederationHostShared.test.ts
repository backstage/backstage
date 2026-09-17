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

import { loadModuleFederationHostShared } from './loadModuleFederationHostShared';
import {
  BACKSTAGE_RUNTIME_SHARED_DEPENDENCIES_GLOBAL,
  RuntimeSharedDependenciesGlobal,
} from './types';
import { ForwardedError } from '@backstage/errors';

const globalSpy = jest.fn();
Object.defineProperty(global, BACKSTAGE_RUNTIME_SHARED_DEPENDENCIES_GLOBAL, {
  get: globalSpy,
});

function mockGlobal(items: RuntimeSharedDependenciesGlobal['items']) {
  globalSpy.mockReturnValue({ items, version: 'v1' });
}

describe('loadModuleFederationHostShared', () => {
  afterEach(jest.resetAllMocks);

  it('should preload and return shared dependencies keyed by name', async () => {
    const reactMock = { default: { React: 'react' } };
    const reactDomMock = { default: { ReactDom: 'react-dom' } };

    mockGlobal([
      {
        name: 'react',
        version: '18.2.0',
        lib: async () => reactMock,
        shareConfig: {
          singleton: true,
          requiredVersion: '*',
          eager: false,
        },
      },
      {
        name: 'react-dom',
        version: '18.2.0',
        lib: async () => reactDomMock,
        shareConfig: {
          singleton: true,
          requiredVersion: '*',
          eager: false,
        },
      },
    ]);
    const shared = await loadModuleFederationHostShared();

    expect(shared).toEqual({
      react: {
        version: '18.2.0',
        lib: expect.any(Function),
        shareConfig: {
          singleton: true,
          requiredVersion: '*',
          eager: false,
        },
      },
      'react-dom': {
        version: '18.2.0',
        lib: expect.any(Function),
        shareConfig: {
          singleton: true,
          requiredVersion: '*',
          eager: false,
        },
      },
    });

    expect(shared?.react?.lib()).toBe(reactMock);
    expect(shared?.['react-dom']?.lib()).toBe(reactDomMock);
  });

  it('should preserve shareConfig properties from each remote', async () => {
    mockGlobal([
      {
        name: 'react',
        version: '18.2.0',
        lib: async () => ({ default: {} }),
        shareConfig: {
          singleton: true,
          requiredVersion: '^18.0.0',
          eager: true,
        },
      },
      {
        name: 'lodash',
        version: '4.17.21',
        lib: async () => ({ default: {} }),
        shareConfig: {
          singleton: false,
          requiredVersion: '^4.17.0',
          eager: false,
        },
      },
    ]);
    const shared = await loadModuleFederationHostShared();

    expect(shared).toEqual({
      react: {
        version: '18.2.0',
        lib: expect.any(Function),
        shareConfig: {
          singleton: true,
          requiredVersion: '^18.0.0',
          eager: true,
        },
      },
      lodash: {
        version: '4.17.21',
        lib: expect.any(Function),
        shareConfig: {
          singleton: false,
          requiredVersion: '^4.17.0',
          eager: false,
        },
      },
    });
  });

  it('should handle empty items', async () => {
    mockGlobal([]);
    expect(await loadModuleFederationHostShared()).toEqual({});
  });

  it('should throw on unsupported or missing version', async () => {
    globalSpy.mockReturnValue({ items: [], version: 'v2' });
    await expect(loadModuleFederationHostShared()).rejects.toThrow(
      'Unsupported version of the runtime shared dependencies: v2',
    );

    globalSpy.mockReturnValue({ items: [] });
    await expect(loadModuleFederationHostShared()).rejects.toThrow(
      'Unsupported version of the runtime shared dependencies: undefined',
    );

    globalSpy.mockReturnValue(undefined);
    await expect(loadModuleFederationHostShared()).rejects.toThrow(
      'Unsupported version of the runtime shared dependencies: undefined',
    );
  });

  it('should report errors via onError and still return successful modules', async () => {
    const mockError = new Error('Module import failed');
    const reactMock = { default: { React: 'react' } };
    const lodashMock = { default: { _: 'lodash' } };

    mockGlobal([
      {
        name: 'react',
        version: '18.2.0',
        lib: async () => reactMock,
        shareConfig: {
          singleton: true,
          requiredVersion: '^18.0.0',
          eager: false,
        },
      },
      {
        name: 'failing-module',
        version: '0.0.0',
        lib: async () => {
          throw mockError;
        },
        shareConfig: {
          singleton: true,
          requiredVersion: '*',
          eager: false,
        },
      },
      {
        name: 'lodash',
        version: '4.17.21',
        lib: async () => lodashMock,
        shareConfig: {
          singleton: true,
          requiredVersion: '^4.17.0',
          eager: false,
        },
      },
    ]);

    const errors: Error[] = [];
    const shared = await loadModuleFederationHostShared({
      onError: err => errors.push(err),
    });

    expect(errors).toHaveLength(1);
    expect(errors[0]).toBeInstanceOf(ForwardedError);
    expect(errors[0].message).toContain(
      'Failed to preload module federation shared dependency',
    );
    expect(errors[0]).toHaveProperty('cause', mockError);

    expect(shared).toEqual({
      react: {
        version: '18.2.0',
        lib: expect.any(Function),
        shareConfig: {
          singleton: true,
          requiredVersion: '^18.0.0',
          eager: false,
        },
      },
      lodash: {
        version: '4.17.21',
        lib: expect.any(Function),
        shareConfig: {
          singleton: true,
          requiredVersion: '^4.17.0',
          eager: false,
        },
      },
    });

    expect(shared?.react?.lib()).toBe(reactMock);
    expect(shared?.lodash?.lib()).toBe(lodashMock);
  });

  it('should throw on failure when no onError is provided', async () => {
    const mockError = new Error('Module import failed');

    mockGlobal([
      {
        name: 'react',
        version: '18.2.0',
        lib: async () => ({ default: {} }),
        shareConfig: {
          singleton: true,
          requiredVersion: '*',
          eager: false,
        },
      },
      {
        name: 'failing-module',
        version: '0.0.0',
        lib: async () => {
          throw mockError;
        },
        shareConfig: {
          singleton: true,
          requiredVersion: '*',
          eager: false,
        },
      },
    ]);

    await expect(loadModuleFederationHostShared()).rejects.toMatchObject({
      message: expect.stringContaining(
        'Failed to preload module federation shared dependency',
      ),
      cause: mockError,
    });
  });

  it('should report multiple errors via onError', async () => {
    const mockError1 = new Error('First module failed');
    const mockError2 = new Error('Second module failed');

    mockGlobal([
      {
        name: 'failing-module-1',
        version: '0.0.0',
        lib: async () => {
          throw mockError1;
        },
        shareConfig: {
          singleton: true,
          requiredVersion: '*',
          eager: false,
        },
      },
      {
        name: 'failing-module-2',
        version: '0.0.0',
        lib: async () => {
          throw mockError2;
        },
        shareConfig: {
          singleton: true,
          requiredVersion: '*',
          eager: false,
        },
      },
    ]);

    const errors: Error[] = [];
    const shared = await loadModuleFederationHostShared({
      onError: err => errors.push(err),
    });

    expect(errors).toHaveLength(2);
    expect(errors[0]).toBeInstanceOf(ForwardedError);
    expect(errors[0]).toHaveProperty('cause', mockError1);
    expect(errors[1]).toBeInstanceOf(ForwardedError);
    expect(errors[1]).toHaveProperty('cause', mockError2);

    expect(shared).toEqual({});
  });
});
