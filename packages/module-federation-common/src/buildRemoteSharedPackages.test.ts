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

import { buildRemoteSharedPackages } from './buildRemoteSharedPackages';
import { SharedImport } from './types';

describe('buildRemoteSharedPackages', () => {
  it('should build shared packages with minimal required properties', () => {
    const sharedImports: SharedImport[] = [
      {
        name: 'react',
        module: async () => ({ default: {} }),
      },
      {
        name: 'react-dom',
        module: async () => ({ default: {} }),
      },
    ];

    const result = buildRemoteSharedPackages(sharedImports);

    expect(result).toEqual({
      react: {
        singleton: true,
        requiredVersion: '*',
        eager: false,
      },
      'react-dom': {
        singleton: true,
        requiredVersion: '*',
        eager: false,
      },
    });
  });

  it('should build shared packages with custom requiredVersion', () => {
    const sharedImports: SharedImport[] = [
      {
        name: 'react',
        module: async () => ({ default: {} }),
        requiredVersion: '^18.0.0',
      },
      {
        name: 'lodash',
        module: async () => ({ default: {} }),
        requiredVersion: '^4.17.0',
      },
    ];

    const result = buildRemoteSharedPackages(sharedImports);

    expect(result).toEqual({
      react: {
        singleton: true,
        requiredVersion: '^18.0.0',
        eager: false,
      },
      lodash: {
        singleton: true,
        requiredVersion: '^4.17.0',
        eager: false,
      },
    });
  });

  it('should build shared packages with import property set to false', () => {
    const sharedImports: SharedImport[] = [
      {
        name: 'react',
        module: async () => ({ default: {} }),
        importInRemote: false,
      },
    ];

    const result = buildRemoteSharedPackages(sharedImports);

    expect(result).toEqual({
      react: {
        singleton: true,
        requiredVersion: '*',
        import: false,
        eager: false,
      },
    });
  });

  it('should handle empty sharedImports array', () => {
    const sharedImports: SharedImport[] = [];

    const result = buildRemoteSharedPackages(sharedImports);

    expect(result).toEqual({});
  });

  it('should handle sharedImports with all optional properties', () => {
    const sharedImports: SharedImport[] = [
      {
        name: 'react',
        module: async () => ({ default: {} }),
        version: '18.2.0',
        requiredVersion: '^18.0.0',
        eagerInHost: false,
        importInRemote: false,
      },
    ];

    const result = buildRemoteSharedPackages(sharedImports);

    expect(result).toEqual({
      react: {
        singleton: true,
        requiredVersion: '^18.0.0',
        import: false,
        eager: false,
      },
    });
  });
});
