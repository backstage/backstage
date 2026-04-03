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
import {
  AuthenticationError,
  NotAllowedError,
  NotFoundError,
} from '@backstage/errors';
import { handleErrors } from './handleErrors';

describe('handleErrors', () => {
  it.each([
    {
      error: new NotFoundError('Action "missing" not found'),
      expected: 'NotFoundError: Action "missing" not found',
    },
    {
      error: new AuthenticationError('Missing token'),
      expected: 'AuthenticationError: Missing token',
    },
    {
      error: new NotAllowedError('Actions must be invoked by a service'),
      expected: 'NotAllowedError: Actions must be invoked by a service',
    },
  ])(
    'maps $error.name to a deterministic MCP message',
    async ({ error, expected }) => {
      const result = await handleErrors(async () => {
        throw error;
      });

      expect(result).toEqual({
        content: [{ type: 'text', text: expected }],
        isError: true,
      });
    },
  );

  it('rethrows unknown errors', async () => {
    await expect(async () =>
      handleErrors(async () => {
        throw new Error('unexpected');
      }),
    ).rejects.toThrow('unexpected');
  });
});
