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

const mockRemoveLocationById = jest.fn();
const mockGetLocations = jest.fn();

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
    removeLocationById: mockRemoveLocationById,
    getLocations: mockGetLocations,
  })),
}));

import catalogUnregister from './catalogUnregister';
import { cli } from 'cleye';

const mockCli = cli as jest.MockedFunction<typeof cli>;

const ctx = (args: string[]): CliCommandContext =>
  ({
    args,
    info: {
      name: 'catalog unregister',
      usage: 'backstage-cli catalog unregister',
    },
  } as unknown as CliCommandContext);

describe('catalog unregister', () => {
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

  it('throws when neither --location-id nor --location-url is provided', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });

    await expect(catalogUnregister(ctx([]))).rejects.toThrow(
      '--location-id or --location-url is required',
    );
  });

  it('removes the location by id', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { 'location-id': 'loc-1' },
    });

    await catalogUnregister(ctx(['--location-id', 'loc-1']));

    expect(mockRemoveLocationById).toHaveBeenCalledWith('loc-1', {
      token: 'tok',
    });
    expect(mockGetLocations).not.toHaveBeenCalled();
    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(JSON.parse(output)).toEqual({});
  });

  it('resolves and removes the location by url', async () => {
    const url =
      'https://github.com/backstage/demo/blob/master/catalog-info.yaml';
    (mockCli as jest.Mock).mockReturnValue({
      flags: { 'location-url': url },
    });
    mockGetLocations.mockResolvedValue({
      items: [
        { id: 'loc-1', type: 'url', target: url },
        { id: 'loc-2', type: 'url', target: 'https://example.com/other.yaml' },
      ],
    });

    await catalogUnregister(ctx(['--location-url', url]));

    expect(mockGetLocations).toHaveBeenCalledWith(undefined, {
      token: 'tok',
    });
    expect(mockRemoveLocationById).toHaveBeenCalledTimes(1);
    expect(mockRemoveLocationById).toHaveBeenCalledWith('loc-1', {
      token: 'tok',
    });
  });

  it('throws when no location matches the given url', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { 'location-url': 'https://example.com/missing.yaml' },
    });
    mockGetLocations.mockResolvedValue({ items: [] });

    await expect(catalogUnregister(ctx([]))).rejects.toThrow(
      'Location with URL https://example.com/missing.yaml not found',
    );
    expect(mockRemoveLocationById).not.toHaveBeenCalled();
  });
});
