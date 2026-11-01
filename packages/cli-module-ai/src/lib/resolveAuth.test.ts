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

const mockCreate = jest.fn();
jest.mock('@backstage/cli-node', () => ({
  CliAuth: { create: (...args: unknown[]) => mockCreate(...args) },
}));

import { resolveAuth } from './resolveAuth';

describe('resolveAuth', () => {
  it('returns the base URL and token for the selected instance', async () => {
    mockCreate.mockResolvedValue({
      getBaseUrl: () => 'https://backstage.example.com',
      getAccessToken: async () => 'tok',
    });
    await expect(resolveAuth('prod')).resolves.toEqual({
      baseUrl: 'https://backstage.example.com',
      accessToken: 'tok',
    });
    expect(mockCreate).toHaveBeenCalledWith({ instanceName: 'prod' });
  });

  it('points at auth login when there is no usable login', async () => {
    mockCreate.mockRejectedValue(new Error('No instances found'));
    await expect(resolveAuth()).rejects.toThrow(
      /No instances found.*backstage-cli auth login/,
    );
  });
});
