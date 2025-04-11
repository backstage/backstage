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

import { createMockDirectory } from '@backstage/backend-test-utils';
import path from 'path';

jest.mock(
  'lodash',
  () =>
    ({
      ...jest.requireActual('lodash'),
      debounce: (fn: any) => fn,
    } as any as typeof import('lodash')),
);

describe('generateOpenApiSchema', () => {
  const inputDir = createMockDirectory();
  const outputDir = createMockDirectory();

  beforeEach(() => {
    inputDir.clear();
    outputDir.clear();

    inputDir.addContent({
      'openapi.yaml': `
          openapi: 3.0.0
          info:
            title: Test API
            version: 1.0.0
          paths:
            /test:
              get:
                responses:
                  '200':
                    description: OK
        `,
    });
    jest.mock('../../../../../lib/openapi/helpers', () => ({
      getPathToCurrentOpenApiSpec: jest.fn(() =>
        Promise.resolve(path.join(inputDir.path, 'openapi.yaml')),
      ),
      loadAndValidateOpenApiYaml: jest.fn(),
    }));
  });
  it('should handle watch mode', async () => {
    const generateClientMock = jest.fn();
    const generateServerMock = jest.fn();
    jest.doMock('./client', () => ({ command: generateClientMock }));
    jest.doMock('./server', () => ({ command: generateServerMock }));

    const mockWatch = jest.fn();
    jest.mock('chokidar', () => ({
      watch: mockWatch,
    }));
    let resolve: (val?: any) => void;
    const block = () =>
      new Promise(res => {
        resolve = res;
      });
    jest.mock('../../../../../lib/runner', () => ({
      block,
    }));

    const mockOn: Record<string, any> = {};
    mockWatch.mockReturnValue({
      on: jest.fn((event, cb) => {
        console.log(event);
        mockOn[event] = cb;
      }),
    } as any);

    // Same logic as https://github.com/backstage/backstage/blob/547e41da5ac497e5a606c08c8fb57b429687d5f7/packages/repo-tools/src/commands/index.ts#L278-L297
    const {
      default: { command },
    } = (await import('./index')) as unknown as {
      default: typeof import('./index');
    };

    const actions = async () => {
      while (!mockOn.ready) {
        // Wait for the watcher to be registered
        await new Promise(r => setTimeout(r, 100));
      }

      expect(generateClientMock).toHaveBeenCalledTimes(1);
      mockOn.change();
      // Wait for the debounce to finish with the initial load.
      await new Promise(r => setTimeout(r, 500));
      expect(generateClientMock).toHaveBeenCalledTimes(2);
      resolve();
    };

    await Promise.all([
      actions(),
      command({ watch: true, clientPackage: 'test123' }),
    ]);
  });
});
