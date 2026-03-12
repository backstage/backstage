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
import { httpJson } from '../../auth/lib/http';

jest.mock('../../auth/lib/http');

const mockHttpJson = httpJson as jest.MockedFunction<typeof httpJson>;

const BASE_URL = 'https://backstage.example.com';
const TOKEN = 'test-token';

const makeAction = (id: string) => ({
  id,
  name: id,
  title: id,
  description: '',
  schema: { input: {}, output: {} },
  attributes: { readOnly: false, destructive: false, idempotent: false },
});

describe('ActionsClient', () => {
  let client: ActionsClient;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new ActionsClient(BASE_URL, TOKEN);
  });

  describe('list', () => {
    it('fetches actions from each plugin source and aggregates results', async () => {
      const actionA = makeAction('plugin-a:action-one');
      const actionB = makeAction('plugin-b:action-two');

      mockHttpJson
        .mockResolvedValueOnce({ actions: [actionA] })
        .mockResolvedValueOnce({ actions: [actionB] });

      const result = await client.list(['plugin-a', 'plugin-b']);

      expect(mockHttpJson).toHaveBeenCalledWith(
        `${BASE_URL}/api/plugin-a/.backstage/actions/v1/actions`,
        { headers: { Authorization: `Bearer ${TOKEN}` } },
      );
      expect(mockHttpJson).toHaveBeenCalledWith(
        `${BASE_URL}/api/plugin-b/.backstage/actions/v1/actions`,
        { headers: { Authorization: `Bearer ${TOKEN}` } },
      );
      expect(result).toEqual([actionA, actionB]);
    });

    it('returns empty array when no plugin sources provided', async () => {
      const result = await client.list([]);
      expect(mockHttpJson).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('skips failed sources and warns instead of throwing', async () => {
      const actionA = makeAction('plugin-a:action-one');
      const warnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      mockHttpJson
        .mockResolvedValueOnce({ actions: [actionA] })
        .mockRejectedValueOnce(new Error('network failure'));

      const result = await client.list(['plugin-a', 'plugin-b']);

      expect(result).toEqual([actionA]);
      expect(warnSpy).toHaveBeenCalledWith(
        'Failed to fetch actions from plugin-b',
        expect.any(Error),
      );

      warnSpy.mockRestore();
    });
  });

  describe('execute', () => {
    it('extracts plugin ID from action ID and POSTs to the correct URL', async () => {
      mockHttpJson.mockResolvedValue({ output: {} });

      await client.execute('my-plugin:do-something', { foo: 'bar' });

      expect(mockHttpJson).toHaveBeenCalledWith(
        `${BASE_URL}/api/my-plugin/.backstage/actions/v1/actions/${encodeURIComponent(
          'my-plugin:do-something',
        )}/invoke`,
        expect.objectContaining({
          method: 'POST',
          headers: { Authorization: `Bearer ${TOKEN}` },
        }),
      );
    });

    it('sends input as body and returns output', async () => {
      const input = { key: 'value' };
      const output = { result: 42 };
      mockHttpJson.mockResolvedValue({ output });

      const result = await client.execute('my-plugin:action', input);

      expect(mockHttpJson).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ body: input }),
      );
      expect(result).toEqual({ output });
    });

    it('works with undefined input', async () => {
      mockHttpJson.mockResolvedValue({ output: null });

      await client.execute('my-plugin:action');

      expect(mockHttpJson).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ body: undefined }),
      );
    });

    it('throws for action IDs without a colon', async () => {
      await expect(client.execute('no-colon-here')).rejects.toThrow(
        'Invalid action id: no-colon-here',
      );
      expect(mockHttpJson).not.toHaveBeenCalled();
    });
  });
});
