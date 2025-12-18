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

import {
  prepareRuntimeSharedDependenciesScript,
  buildRuntimeSharedUserOption,
} from './runtime';
import { ForwardedError } from '@backstage/errors';

describe('prepareRuntimeSharedDependenciesScript', () => {
  it('should generate script with minimal required properties', () => {
    const sharedDependencies = {
      react: {
        version: '18.2.0',
        requiredVersion: '*',
      },
    };

    const result = prepareRuntimeSharedDependenciesScript(sharedDependencies);

    expect(result)
      .toBe(`window['__backstage-module-federation-shared-dependencies__'] = {
  "react": {
    "version": "18.2.0",
    "requiredVersion": "*",
    "module": () => import('react')
  }
};`);
  });

  it('should handle multiple shared dependencies', () => {
    const sharedDependencies = {
      react: {
        version: '18.2.0',
        requiredVersion: '*',
      },
      'react-dom': {
        version: '18.2.0',
        requiredVersion: '*',
      },
      lodash: {
        version: '4.17.21',
        requiredVersion: '*',
      },
    };

    const result = prepareRuntimeSharedDependenciesScript(sharedDependencies);

    expect(result)
      .toBe(`window['__backstage-module-federation-shared-dependencies__'] = {
  "react": {
    "version": "18.2.0",
    "requiredVersion": "*",
    "module": () => import('react')
  },
  "react-dom": {
    "version": "18.2.0",
    "requiredVersion": "*",
    "module": () => import('react-dom')
  },
  "lodash": {
    "version": "4.17.21",
    "requiredVersion": "*",
    "module": () => import('lodash')
  }
};`);
  });

  it('should include requiredVersion when provided', () => {
    const sharedDependencies = {
      react: {
        version: '18.2.0',
        requiredVersion: '^18.0.0',
      },
    };

    const result = prepareRuntimeSharedDependenciesScript(sharedDependencies);

    expect(result)
      .toBe(`window['__backstage-module-federation-shared-dependencies__'] = {
  "react": {
    "version": "18.2.0",
    "requiredVersion": "^18.0.0",
    "module": () => import('react')
  }
};`);
  });

  it('should include requiredVersion when set to false', () => {
    const sharedDependencies = {
      react: {
        version: '18.2.0',
        requiredVersion: false as const,
      },
    };

    const result = prepareRuntimeSharedDependenciesScript(sharedDependencies);

    expect(result)
      .toBe(`window['__backstage-module-federation-shared-dependencies__'] = {
  "react": {
    "version": "18.2.0",
    "requiredVersion": false,
    "module": () => import('react')
  }
};`);
  });

  it('should include singleton when true', () => {
    const sharedDependencies = {
      react: {
        version: '18.2.0',
        requiredVersion: '*',
        singleton: true,
      },
    };

    const result = prepareRuntimeSharedDependenciesScript(sharedDependencies);

    expect(result)
      .toBe(`window['__backstage-module-federation-shared-dependencies__'] = {
  "react": {
    "version": "18.2.0",
    "requiredVersion": "*",
    "singleton": true,
    "module": () => import('react')
  }
};`);
  });

  it('should include singleton when false', () => {
    const sharedDependencies = {
      lodash: {
        version: '4.17.21',
        requiredVersion: '*',
        singleton: false,
      },
    };

    const result = prepareRuntimeSharedDependenciesScript(sharedDependencies);

    expect(result)
      .toBe(`window['__backstage-module-federation-shared-dependencies__'] = {
  "lodash": {
    "version": "4.17.21",
    "requiredVersion": "*",
    "singleton": false,
    "module": () => import('lodash')
  }
};`);
  });

  it('should include eager when true', () => {
    const sharedDependencies = {
      react: {
        version: '18.2.0',
        requiredVersion: '*',
        eager: true,
      },
    };

    const result = prepareRuntimeSharedDependenciesScript(sharedDependencies);

    expect(result)
      .toBe(`window['__backstage-module-federation-shared-dependencies__'] = {
  "react": {
    "version": "18.2.0",
    "requiredVersion": "*",
    "eager": true,
    "module": () => import('react')
  }
};`);
  });

  it('should include eager when false', () => {
    const sharedDependencies = {
      lodash: {
        version: '4.17.21',
        requiredVersion: '*',
        eager: false,
      },
    };

    const result = prepareRuntimeSharedDependenciesScript(sharedDependencies);

    expect(result)
      .toBe(`window['__backstage-module-federation-shared-dependencies__'] = {
  "lodash": {
    "version": "4.17.21",
    "requiredVersion": "*",
    "eager": false,
    "module": () => import('lodash')
  }
};`);
  });

  it('should handle all properties together', () => {
    const sharedDependencies = {
      react: {
        version: '18.2.0',
        requiredVersion: '^18.0.0',
        singleton: true,
        eager: false,
      },
    };

    const result = prepareRuntimeSharedDependenciesScript(sharedDependencies);

    expect(result)
      .toBe(`window['__backstage-module-federation-shared-dependencies__'] = {
  "react": {
    "version": "18.2.0",
    "requiredVersion": "^18.0.0",
    "singleton": true,
    "eager": false,
    "module": () => import('react')
  }
};`);
  });

  it('should handle empty object', () => {
    const sharedDependencies = {};

    const result = prepareRuntimeSharedDependenciesScript(sharedDependencies);

    expect(result).toBe(
      `window['__backstage-module-federation-shared-dependencies__'] = {};`,
    );
  });

  it('should handle scoped package names and special characters', () => {
    const sharedDependencies = {
      '@backstage/core-plugin-api': {
        version: '1.0.0',
        requiredVersion: '*',
      },
    };

    const result = prepareRuntimeSharedDependenciesScript(sharedDependencies);

    expect(result)
      .toBe(`window['__backstage-module-federation-shared-dependencies__'] = {
  "@backstage/core-plugin-api": {
    "version": "1.0.0",
    "requiredVersion": "*",
    "module": () => import('@backstage/core-plugin-api')
  }
};`);
  });
});

const globalSpy = jest.fn();
Object.defineProperty(
  global,
  '__backstage-module-federation-shared-dependencies__',
  {
    get: globalSpy,
  },
);

describe('getRuntimeSharedDependencies', () => {
  afterEach(jest.resetAllMocks);

  it('should get runtime shared dependencies with minimal required properties', async () => {
    const reactMock = { default: { React: 'react' } };
    const reactDomMock = { default: { ReactDom: 'react-dom' } };

    globalSpy.mockReturnValue({
      react: {
        version: '18.2.0',
        requiredVersion: '*',
        module: async () => reactMock,
      },
      'react-dom': {
        version: '18.2.0',
        requiredVersion: '*',
        module: async () => reactDomMock,
      },
    });
    const result = await buildRuntimeSharedUserOption();

    expect(result.errors).toEqual([]);
    expect(result.shared).toEqual({
      react: {
        version: '18.2.0',
        lib: expect.any(Function),
        shareConfig: {
          requiredVersion: '*',
        },
      },
      'react-dom': {
        version: '18.2.0',
        lib: expect.any(Function),
        shareConfig: {
          requiredVersion: '*',
        },
      },
    });

    // Test that lib functions return the correct modules
    expect((result?.shared?.react as { lib: () => any }).lib()).toBe(reactMock);
    expect((result?.shared?.['react-dom'] as { lib: () => any }).lib()).toBe(
      reactDomMock,
    );
  });

  it('should get runtime shared dependencies with custom version and requiredVersion', async () => {
    globalSpy.mockReturnValue({
      react: {
        module: async () => ({ default: {} }),
        version: '18.2.0',
        requiredVersion: '^18.0.0',
      },
      lodash: {
        module: async () => ({ default: {} }),
        version: '4.17.21',
        requiredVersion: '^4.17.0',
      },
    });
    const result = await buildRuntimeSharedUserOption();

    expect(result.errors).toEqual([]);
    expect(result.shared).toEqual({
      react: {
        version: '18.2.0',
        lib: expect.any(Function),
        shareConfig: {
          requiredVersion: '^18.0.0',
        },
      },
      lodash: {
        version: '4.17.21',
        lib: expect.any(Function),
        shareConfig: {
          requiredVersion: '^4.17.0',
        },
      },
    });
  });

  it('should handle eager', async () => {
    globalSpy.mockReturnValue({
      react: {
        version: '18.2.0',
        requiredVersion: '*',
        eager: false,
        module: async () => ({ default: {} }),
      },
      lodash: {
        version: '4.17.21',
        requiredVersion: '*',
        eager: true,
        module: async () => ({ default: {} }),
      },
    });
    const result = await buildRuntimeSharedUserOption();

    expect(result.errors).toEqual([]);
    expect(result.shared).toEqual({
      react: {
        version: '18.2.0',
        lib: expect.any(Function),
        shareConfig: {
          requiredVersion: '*',
          eager: false,
        },
      },
      lodash: {
        version: '4.17.21',
        lib: expect.any(Function),
        shareConfig: {
          requiredVersion: '*',
          eager: true,
        },
      },
    });
  });

  it('should handle singleton', async () => {
    globalSpy.mockReturnValue({
      react: {
        module: async () => ({ default: {} }),
        version: '18.2.0',
        requiredVersion: '*',
        singleton: true,
      },
      lodash: {
        module: async () => ({ default: {} }),
        version: '4.17.21',
        requiredVersion: '*',
        singleton: false,
      },
    });
    const result = await buildRuntimeSharedUserOption();

    expect(result.errors).toEqual([]);
    expect(result.shared).toEqual({
      react: {
        version: '18.2.0',
        lib: expect.any(Function),
        shareConfig: {
          requiredVersion: '*',
          singleton: true,
        },
      },
      lodash: {
        version: '4.17.21',
        lib: expect.any(Function),
        shareConfig: {
          requiredVersion: '*',
          singleton: false,
        },
      },
    });
  });

  it('should handle an empty object', async () => {
    globalSpy.mockReturnValue({});
    const result = await buildRuntimeSharedUserOption();

    expect(result.errors).toEqual([]);
    expect(result.shared).toEqual({});
  });

  it('should handle module import failures and collect errors', async () => {
    const mockError = new Error('Module import failed');
    const reactMock = { default: { React: 'react' } };
    const lodashMock = { default: { _: 'lodash' } };

    globalSpy.mockReturnValue({
      react: {
        module: async () => reactMock,
        version: '18.2.0',
        requiredVersion: '^18.0.0',
      },
      'failing-module': {
        module: async () => {
          throw mockError;
        },
      },
      lodash: {
        module: async () => lodashMock,
        version: '4.17.21',
        requiredVersion: '^4.17.0',
      },
    });

    const result = await buildRuntimeSharedUserOption();

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toBeInstanceOf(ForwardedError);
    expect(result.errors[0].message).toContain(
      'Failed to dynamically import "failing-module" and add it to module federation shared dependencies:',
    );
    expect(result.errors[0].cause).toBe(mockError);

    // Should still include successful modules
    expect(result.shared).toEqual({
      react: {
        version: '18.2.0',
        lib: expect.any(Function),
        shareConfig: {
          requiredVersion: '^18.0.0',
        },
      },
      lodash: {
        version: '4.17.21',
        lib: expect.any(Function),
        shareConfig: {
          requiredVersion: '^4.17.0',
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
    globalSpy.mockReturnValue({
      'failing-module-1': {
        module: async () => {
          throw mockError1;
        },
      },
      'failing-module-2': {
        module: async () => {
          throw mockError2;
        },
      },
    });

    const result = await buildRuntimeSharedUserOption();

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
