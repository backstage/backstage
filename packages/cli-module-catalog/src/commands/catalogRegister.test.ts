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

import type { CliCommandContext } from '@backstage/cli-node';

const mockAddLocation = jest.fn();

jest.mock('cleye', () => ({
  cli: jest.fn().mockReturnValue({ flags: {} }),
}));
jest.mock('../lib/resolveAuth', () => ({
  resolveAuth: jest.fn().mockResolvedValue({
    accessToken: 'tok',
    baseUrl: 'https://backstage.example.com',
    instanceName: 'default',
    pluginSources: ['catalog'],
  }),
}));
jest.mock('../lib/catalogClient', () => ({
  createCatalogClient: jest.fn().mockImplementation(() => ({
    addLocation: mockAddLocation,
  })),
}));

import catalogRegister from './catalogRegister';
import { cli } from 'cleye';

const mockCli = cli as jest.MockedFunction<typeof cli>;

const ctx = (args: string[]): CliCommandContext =>
  ({
    args,
    info: { name: 'catalog register', usage: 'backstage-cli catalog register' },
  } as unknown as CliCommandContext);

describe('catalog register', () => {
  let stdoutSpy: jest.SpiedFunction<typeof process.stdout.write>;

  beforeEach(() => {
    jest.clearAllMocks();
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
  });

  it('throws when --location-url is missing', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });

    await expect(catalogRegister(ctx([]))).rejects.toThrow(
      '--location-url is required',
    );
  });

  it('throws when --location-url is not a valid URL', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { 'location-url': 'not-a-url' },
    });

    await expect(catalogRegister(ctx([]))).rejects.toThrow(
      'not-a-url is an invalid URL',
    );
    expect(mockAddLocation).not.toHaveBeenCalled();
  });

  it('registers the location and outputs the location id', async () => {
    const url =
      'https://github.com/backstage/demo/blob/master/catalog-info.yaml';
    (mockCli as jest.Mock).mockReturnValue({
      flags: { 'location-url': url },
    });
    mockAddLocation.mockResolvedValue({
      location: { id: 'loc-1', type: 'url', target: url },
      entities: [],
    });

    await catalogRegister(ctx(['--location-url', url]));

    expect(mockAddLocation).toHaveBeenCalledWith(
      { type: 'url', target: url },
      { token: 'tok' },
    );
    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(JSON.parse(output)).toEqual({ locationId: 'loc-1' });
  });
});
