/*
 * Copyright 2020 The Backstage Authors
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
import { PlaceholderResolverParams } from '@backstage/plugin-catalog-backend';
import { openApiPlaceholderResolver } from './openApiPlaceholderResolver';
import { bundleOpenApiSpecification } from './lib';

jest.mock('./lib', () => ({
  bundleOpenApiSpecification: jest.fn(),
}));

const bundledSpecification = '<bundled-specification>';

describe('openApiPlaceholderResolver', () => {
  const mockResolveUrl = jest.fn();
  mockResolveUrl.mockReturnValue('mockUrl');

  const mockRead = jest.fn();
  mockRead.mockResolvedValue(Buffer.from('mockData'));

  const params: PlaceholderResolverParams = {
    key: 'openapi',
    value: './spec/openapi.yaml',
    baseUrl: 'https://github.com/owner/repo/blob/main/catalog-info.yaml',
    resolveUrl: mockResolveUrl,
    read: mockRead,
    emit: jest.fn(),
  };

  beforeEach(() => {
    (bundleOpenApiSpecification as any).mockResolvedValue(bundledSpecification);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if unable to bundle the OpenAPI specification', async () => {
    (bundleOpenApiSpecification as any).mockRejectedValue(new Error('TEST'));

    await expect(openApiPlaceholderResolver(params)).rejects.toThrow(
      'Placeholder $openapi unable to bundle OpenAPI specification',
    );
  });

  it('should bundle the OpenAPI specification', async () => {
    const result = await openApiPlaceholderResolver(params);

    expect(result).toEqual(bundledSpecification);
  });
});
