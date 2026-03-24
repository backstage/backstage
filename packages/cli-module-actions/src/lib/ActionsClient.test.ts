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

import { ActionsClient } from './ActionsClient';
import { httpJson } from './httpJson';

jest.mock('./httpJson', () => ({
  httpJson: jest.fn(),
}));

const mockHttpJson = httpJson as jest.MockedFunction<typeof httpJson>;

describe('ActionsClient', () => {
  const baseUrl = 'https://backstage.example.com';
  const accessToken = 'test-token';
  let client: ActionsClient;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new ActionsClient(baseUrl, accessToken);
  });

  describe('list', () => {
    it('returns empty array when no plugin sources provided', async () => {
      const result = await client.list([]);
      expect(result).toEqual([]);
      expect(mockHttpJson).not.toHaveBeenCalled();
    });

    it('fetches actions from each plugin source', async () => {
      const catalogActions = [
        {
          id: 'catalog:refresh',
          name: 'refresh',
          schema: { input: {}, output: {} },
        },
      ];
      const scaffolderActions = [
        {
          id: 'scaffolder:run',
          name: 'run',
          schema: { input: {}, output: {} },
        },
      ];

      mockHttpJson
        .mockResolvedValueOnce({ actions: catalogActions })
        .mockResolvedValueOnce({ actions: scaffolderActions });

      const result = await client.list(['catalog', 'scaffolder']);

      expect(mockHttpJson).toHaveBeenCalledTimes(2);
      expect(mockHttpJson).toHaveBeenCalledWith(
        'https://backstage.example.com/api/catalog/.backstage/actions/v1/actions',
        expect.objectContaining({
          headers: { Authorization: 'Bearer test-token' },
        }),
      );
      expect(mockHttpJson).toHaveBeenCalledWith(
        'https://backstage.example.com/api/scaffolder/.backstage/actions/v1/actions',
        expect.objectContaining({
          headers: { Authorization: 'Bearer test-token' },
        }),
      );
      expect(result).toEqual([...catalogActions, ...scaffolderActions]);
    });

    it('propagates errors from httpJson', async () => {
      mockHttpJson.mockRejectedValue(new Error('Network error'));

      await expect(client.list(['catalog'])).rejects.toThrow('Network error');
    });
  });

  describe('execute', () => {
    it('posts to the correct invoke endpoint', async () => {
      mockHttpJson.mockResolvedValue({ output: { result: 'ok' } });

      const output = await client.execute('catalog:refresh', {
        entityRef: 'component:default/foo',
      });

      expect(mockHttpJson).toHaveBeenCalledWith(
        'https://backstage.example.com/api/catalog/.backstage/actions/v1/actions/catalog%3Arefresh/invoke',
        expect.objectContaining({
          method: 'POST',
          headers: { Authorization: 'Bearer test-token' },
          body: { entityRef: 'component:default/foo' },
        }),
      );
      expect(output).toEqual({ result: 'ok' });
    });

    it('sends empty object when no input provided', async () => {
      mockHttpJson.mockResolvedValue({ output: null });

      await client.execute('catalog:refresh');

      expect(mockHttpJson).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ body: {} }),
      );
    });

    it('extracts pluginId from actionId to build correct URL', async () => {
      mockHttpJson.mockResolvedValue({ output: {} });

      await client.execute('my-plugin:some-action');

      expect(mockHttpJson).toHaveBeenCalledWith(
        expect.stringContaining('/api/my-plugin/'),
        expect.any(Object),
      );
    });
  });
});
