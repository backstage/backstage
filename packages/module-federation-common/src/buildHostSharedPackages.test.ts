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

import { buildHostSharedPackages } from './buildHostSharedPackages';
import { SharedImport } from './types';
import { ForwardedError } from '@backstage/errors';

describe('buildHostSharedPackages', () => {
  it('should build shared packages with minimal required properties', async () => {
    const reactMock = { default: { React: 'react' } };
    const reactDomMock = { default: { ReactDom: 'react-dom' } };
    const sharedImports: SharedImport[] = [
      {
        name: 'react',
        module: async () => reactMock,
      },
      {
        name: 'react-dom',
        module: async () => reactDomMock,
      },
    ];

    const result = await buildHostSharedPackages(sharedImports);

    expect(result.errors).toEqual([]);
    expect(result.shared).toEqual({
      react: {
        version: '*',
        lib: expect.any(Function),
        shareConfig: {
          singleton: true,
          requiredVersion: '*',
          eager: true,
        },
      },
      'react-dom': {
        version: '*',
        lib: expect.any(Function),
        shareConfig: {
          singleton: true,
          requiredVersion: '*',
          eager: true,
        },
      },
    });

    // Test that lib functions return the correct modules
    expect((result?.shared?.react as { lib: () => any }).lib()).toBe(reactMock);
    expect((result?.shared?.['react-dom'] as { lib: () => any }).lib()).toBe(
      reactDomMock,
    );
  });

  it('should build shared packages with custom version and requiredVersion', async () => {
    const sharedImports: SharedImport[] = [
      {
        name: 'react',
        module: async () => ({ default: {} }),
        version: '18.2.0',
        requiredVersion: '^18.0.0',
      },
      {
        name: 'lodash',
        module: async () => ({ default: {} }),
        version: '4.17.21',
        requiredVersion: '^4.17.0',
      },
    ];

    const result = await buildHostSharedPackages(sharedImports);

    expect(result.errors).toEqual([]);
    expect(result.shared).toEqual({
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
          singleton: true,
          requiredVersion: '^4.17.0',
          eager: true,
        },
      },
    });
  });

  it('should handle eagerInHost set to false', async () => {
    const sharedImports: SharedImport[] = [
      {
        name: 'react',
        module: async () => ({ default: {} }),
        eagerInHost: false,
      },
    ];

    const result = await buildHostSharedPackages(sharedImports);

    expect(result.errors).toEqual([]);
    expect(result.shared).toEqual({
      react: {
        version: '*',
        lib: expect.any(Function),
        shareConfig: {
          singleton: true,
          requiredVersion: '*',
          eager: false,
        },
      },
    });
  });

  it('should handle eagerInHost set to undefined (defaults to true)', async () => {
    const sharedImports: SharedImport[] = [
      {
        name: 'react',
        module: async () => ({ default: {} }),
        eagerInHost: undefined,
      },
    ];

    const result = await buildHostSharedPackages(sharedImports);

    expect(result.errors).toEqual([]);
    expect(result.shared).toEqual({
      react: {
        version: '*',
        lib: expect.any(Function),
        shareConfig: {
          singleton: true,
          requiredVersion: '*',
          eager: true,
        },
      },
    });
  });

  it('should handle empty sharedImports array', async () => {
    const sharedImports: SharedImport[] = [];

    const result = await buildHostSharedPackages(sharedImports);

    expect(result.errors).toEqual([]);
    expect(result.shared).toEqual({});
  });

  it('should handle module import failures and collect errors', async () => {
    const mockError = new Error('Module import failed');
    const reactMock = { default: { React: 'react' } };
    const lodashMock = { default: { _: 'lodash' } };

    const sharedImports: SharedImport[] = [
      {
        name: 'react',
        module: async () => reactMock,
        version: '18.0.0',
        requiredVersion: '^18.0.0',
        eagerInHost: false,
      },
      {
        name: 'failing-module',
        module: async () => {
          throw mockError;
        },
      },
      {
        name: 'lodash',
        module: async () => lodashMock,
        version: '4.17.21',
        requiredVersion: '^4.17.0',
        eagerInHost: undefined,
      },
    ];

    const result = await buildHostSharedPackages(sharedImports);

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toBeInstanceOf(ForwardedError);
    expect(result.errors[0].message).toContain(
      'Failed to dynamically import "failing-module" and add it to module federation shared packages:',
    );
    expect(result.errors[0].cause).toBe(mockError);

    // Should still include successful modules
    expect(result.shared).toEqual({
      react: {
        version: '18.0.0',
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
          eager: true,
        },
      },
    });

    // Test that lib functions work correctly
    expect((result?.shared?.react as { lib: () => any }).lib()).toBe(reactMock);
    expect((result?.shared?.lodash as { lib: () => any }).lib()).toBe(
      lodashMock,
    );
  });

  it('should handle multiple module import failures', async () => {
    const mockError1 = new Error('First module failed');
    const mockError2 = new Error('Second module failed');
    const sharedImports: SharedImport[] = [
      {
        name: 'failing-module-1',
        module: async () => {
          throw mockError1;
        },
      },
      {
        name: 'failing-module-2',
        module: async () => {
          throw mockError2;
        },
      },
    ];

    const result = await buildHostSharedPackages(sharedImports);

    expect(result.errors).toHaveLength(2);
    expect(result.errors[0]).toBeInstanceOf(ForwardedError);
    expect(result.errors[0].message).toContain('failing-module-1');
    expect(result.errors[0].cause).toBe(mockError1);
    expect(result.errors[1]).toBeInstanceOf(ForwardedError);
    expect(result.errors[1].message).toContain('failing-module-2');
    expect(result.errors[1].cause).toBe(mockError2);

    expect(result.shared).toEqual({});
  });
});
