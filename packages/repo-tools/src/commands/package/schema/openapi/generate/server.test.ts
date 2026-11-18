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

import { getPathToCurrentOpenApiSpec } from '../../../../../lib/openapi/helpers';
import { command } from './server';

jest.mock('../../../../../lib/openapi/helpers', () => ({
  ...jest.requireActual('../../../../../lib/openapi/helpers'),
  getPathToCurrentOpenApiSpec: jest.fn(),
}));

const mockGetPathToCurrentOpenApiSpec =
  getPathToCurrentOpenApiSpec as jest.MockedFunction<
    typeof getPathToCurrentOpenApiSpec
  >;

describe('generate server command', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'debug').mockImplementation(() => {});
    jest.spyOn(console, 'group').mockImplementation(() => {});
    jest.spyOn(console, 'groupEnd').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('rejects when generation fails', async () => {
    mockGetPathToCurrentOpenApiSpec.mockRejectedValue(
      new Error('Could not find openapi.yaml'),
    );

    await expect(command({})).rejects.toThrow(
      'OpenAPI server stub generation failed; caused by Error: Could not find openapi.yaml',
    );
    expect(console.log).not.toHaveBeenCalled();
  });

  it('does not reject in watch mode so that watching can continue', async () => {
    mockGetPathToCurrentOpenApiSpec.mockRejectedValue(
      new Error('Could not find openapi.yaml'),
    );

    await expect(command({ isWatch: true })).resolves.toBeUndefined();
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Server generation failed:'),
    );
  });

  it('does not reject when generation is aborted', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    mockGetPathToCurrentOpenApiSpec.mockRejectedValue(abortError);

    await expect(command({})).resolves.toBeUndefined();
  });
});
