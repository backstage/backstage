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

import { mergeSharedDependencies } from './merge';
import { Host, Remote, Runtime } from './types';

describe('mergeSharedDependencies', () => {
  let consoleInfoSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
  });

  afterEach(() => {
    consoleInfoSpy.mockRestore();
  });

  it('should return original shared dependencies when config is undefined', () => {
    expect(
      mergeSharedDependencies(
        {
          react: {
            singleton: true,
          },
        },
        undefined,
        'allow-additions',
      ),
    ).toStrictEqual({
      react: {
        singleton: true,
      },
    });
    expect(consoleInfoSpy).not.toHaveBeenCalled();
  });

  it('should remove shared dependencies when config sets them to false', () => {
    expect(
      mergeSharedDependencies(
        {
          react: {
            singleton: true,
          },
          'react-dom': {
            singleton: true,
          },
          lodash: {
            singleton: false,
          },
        },
        {
          'react-dom': false,
          lodash: false,
        },
        'allow-additions',
      ),
    ).toEqual({
      react: {
        singleton: true,
      },
    });
    expect(consoleInfoSpy).toHaveBeenCalledTimes(2);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "Removing module federation shared dependency 'lodash' as it is not in the configured shared dependencies",
    );
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "Removing module federation shared dependency 'react-dom' as it is not in the configured shared dependencies",
    );
  });

  it('should add new shared dependencies', () => {
    expect(
      mergeSharedDependencies(
        {
          react: {
            singleton: true,
          },
        },
        {
          'react-dom': {
            singleton: true,
          },
          lodash: {
            singleton: false,
          },
        },
        'allow-additions',
      ),
    ).toEqual({
      react: {
        singleton: true,
      },
      'react-dom': {
        singleton: true,
      },
      lodash: {
        singleton: false,
      },
    });
    expect(consoleInfoSpy).toHaveBeenCalledTimes(2);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "Adding module federation shared dependency 'react-dom' from the configured shared dependencies",
    );
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "Adding module federation shared dependency 'lodash' from the configured shared dependencies",
    );
  });

  it('should ignore new shared dependencies when ignore-additions mode is used', () => {
    expect(
      mergeSharedDependencies<Host, Runtime>(
        {
          react: {
            version: '18.2.0',
            singleton: true,
            requiredVersion: '*',
            module: () => Promise.resolve({ default: {} }),
          },
        },
        {
          'react-dom': {
            singleton: true,
            requiredVersion: '*',
          },
          lodash: {
            singleton: false,
            requiredVersion: '*',
          },
        },
        'ignore-additions',
      ),
    ).toEqual({
      react: {
        version: '18.2.0',
        singleton: true,
        requiredVersion: '*',
        module: expect.any(Function),
      },
    });
    expect(consoleInfoSpy).toHaveBeenCalledTimes(2);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "Ignoring new module federation shared dependency 'react-dom' from the configured shared dependencies",
    );
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "Ignoring new module federation shared dependency 'lodash' from the configured shared dependencies",
    );
  });

  it('should update shared dependency properties', () => {
    expect(
      mergeSharedDependencies<Host>(
        {
          react: {
            requiredVersion: '*',
          },
        },
        {
          react: {
            requiredVersion: '*',
            singleton: true,
            eager: false,
          },
        },
        'allow-additions',
      ),
    ).toEqual({
      react: {
        singleton: true,
        requiredVersion: '*',
        eager: false,
      },
    });
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "Updating module federation shared dependency 'react' from the configured shared dependencies",
    );
  });

  it('should override existing properties in shared dependency', () => {
    expect(
      mergeSharedDependencies<Host>(
        {
          react: {
            requiredVersion: '*',
            singleton: false,
          },
        },
        {
          react: {
            requiredVersion: '^18.0.0',
            singleton: true,
          },
        },
        'allow-additions',
      ),
    ).toEqual({
      react: {
        requiredVersion: '^18.0.0',
        singleton: true,
      },
    });
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "Updating module federation shared dependency 'react' from the configured shared dependencies",
    );
  });

  it('should not update dependency when config values are identical', () => {
    expect(
      mergeSharedDependencies<Host>(
        {
          react: {
            requiredVersion: '^18.0.0',
            singleton: true,
          },
        },
        {
          react: {
            requiredVersion: '^18.0.0',
            singleton: true,
          },
        },
        'allow-additions',
      ),
    ).toEqual({
      react: {
        requiredVersion: '^18.0.0',
        singleton: true,
      },
    });
    expect(consoleInfoSpy).not.toHaveBeenCalled();
  });

  it('should handle mixed operations (remove, update, keep)', () => {
    expect(
      mergeSharedDependencies<Host>(
        {
          react: {
            requiredVersion: '*',
          },
          'react-dom': {
            requiredVersion: '*',
          },
          lodash: {
            requiredVersion: '*',
          },
          axios: {
            requiredVersion: '*',
          },
        },
        {
          react: {
            singleton: true,
            requiredVersion: '*',
          },
          'react-dom': false,
          // lodash not in config, should be kept as-is
          // axios not in config, should be kept as-is
        },
        'allow-additions',
      ),
    ).toEqual({
      react: {
        requiredVersion: '*',
        singleton: true,
      },
      lodash: {
        requiredVersion: '*',
      },
      axios: {
        requiredVersion: '*',
      },
    });
    expect(consoleInfoSpy).toHaveBeenCalledTimes(2);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "Removing module federation shared dependency 'react-dom' as it is not in the configured shared dependencies",
    );
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "Updating module federation shared dependency 'react' from the configured shared dependencies",
    );
  });

  it('should handle config with only empty object for a dependency', () => {
    // Empty config object should not trigger update since no keys differ
    expect(
      mergeSharedDependencies<Remote>(
        {
          react: {
            singleton: true,
          },
        },
        {
          react: {},
        },
        'allow-additions',
      ),
    ).toEqual({
      react: {
        singleton: true,
      },
    });
    expect(consoleInfoSpy).not.toHaveBeenCalled();
  });

  it('should switch back remote fields to module federation default with null value', () => {
    expect(
      mergeSharedDependencies<Remote>(
        {
          react: {
            singleton: true,
            requiredVersion: '*',
            import: false,
          },
        },
        {
          react: {
            requiredVersion: null,
            import: null,
          },
        },
        'allow-additions',
      ),
    ).toEqual({
      react: {
        singleton: true,
      },
    });
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "Updating module federation shared dependency 'react' from the configured shared dependencies",
    );
  });
});
