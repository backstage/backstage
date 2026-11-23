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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { exec } from '../../../../../lib/exec';
import { getRelativePathToFile } from '../../../../../lib/openapi/helpers';
import { command as generateClient } from './client';
import { command as generateServer } from './server';

jest.mock('../../../../../lib/exec', () => ({
  exec: jest.fn(),
}));

jest.mock('../../../../../lib/openapi/helpers', () => ({
  ...jest.requireActual('../../../../../lib/openapi/helpers'),
  getPathToCurrentOpenApiSpec: jest.fn(async () => '/spec/openapi.yaml'),
  getOpenApiGeneratorKey: jest.fn(async () => 'v3.0'),
  getRelativePathToFile: jest.fn(),
}));

const mockExec = exec as jest.MockedFunction<typeof exec>;
const mockGetRelativePathToFile = getRelativePathToFile as jest.MockedFunction<
  typeof getRelativePathToFile
>;

describe('OpenAPI generator invocation', () => {
  const outputDir = createMockDirectory();

  beforeEach(() => {
    outputDir.clear();
    mockExec.mockReset();
    // Stop after the openapi-generator call, we only care about its arguments.
    mockExec.mockRejectedValue(new Error('stop'));
    mockGetRelativePathToFile.mockResolvedValue(outputDir.path);
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function getGeneratorArgs() {
    expect(mockExec).toHaveBeenCalledTimes(1);
    const [command, args] = mockExec.mock.calls[0];
    expect(command).toBe('node');
    return args!;
  }

  it.each([
    ['client', () => generateClient(outputDir.path).catch(() => {})],
    ['server', () => generateServer({}).catch(() => {})],
  ])(
    'puts all operations under a single tag when generating the %s',
    async (_name, generate) => {
      await generate();

      const args = getGeneratorArgs();
      expect(args).toContain(
        '--openapi-normalizer=SET_TAGS_FOR_ALL_OPERATIONS=default',
      );
    },
  );
});
